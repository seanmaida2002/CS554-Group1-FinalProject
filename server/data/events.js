import { events, users } from "../config/mongoCollections.js";
import xss from "xss";
import { checkString, checkID, checkValidEventName, checkValidEventDate, checkValidSport, checkValidEventSize, checkValidTags, checkValidLocation, checkValidUser, checkValidEventTime, checkValidUsername, checkValidComment } from "../helpers.js";
import { ObjectId } from "mongodb";

export const createEvent = async (eventName, sport, location, eventSize, eventOrganizer, tags, description, date, time , imageUrl) => {
    // Error Checking
    eventName = checkValidEventName(eventName, 'Event Name');
    eventName = xss(eventName);
    sport = checkValidSport(sport, 'Sport');
    location = checkValidLocation(location, 'Location');
    location = xss(location);
    eventSize = checkValidEventSize(eventSize, 'Event Size');
    eventOrganizer = await checkValidUser(eventOrganizer);
    tags = checkValidTags(tags, 'tags');
    description = checkString(description, 'description');
    description = xss(description);
    date = checkValidEventDate(date, 'Event Date')
    time = checkValidEventTime(time, 'Event Time');

    let newEvent = {
        eventName: eventName,
        sport: sport, 
        location: location, 
        eventSize: eventSize,
        imageUrl, imageUrl,
        eventOrganizer: eventOrganizer, 
        date: date,
        time: time,
        tags: tags,
        description: description, 
        usersSignedUp: [eventOrganizer],
        comments: []
    }

    const eventsCollection = await events();
    const insertInfo = await eventsCollection.insertOne(newEvent);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Unable to add Event.";

    const event = await eventsCollection.findOne({ _id: insertInfo.insertedId });
    const usersCollection = await users();
    await usersCollection.findOneAndUpdate(
        {firebaseUid: eventOrganizer}, 
        {$push: {eventsMade: insertInfo.insertedId.toString(), eventsAttending: insertInfo.insertedId.toString()}}, 
        { returnDocument: "after" });

    return event;
}

export const getAllEvents = async() => {
    const eventsCollection = await events();
    let evenstArray = await eventsCollection.find().project().toArray();
    if(!evenstArray) throw "Error: could not get all the products.";
    if(evenstArray.length === 0) return [];
    let eventsReturned = evenstArray.filter((event) => {
        let date = event.date;
        date = date.split('/');
        const givenDate = new Date(`${date[2]}-${date[0]}-${date[1]}`);
        // Below checks to see whether or not the date given takes place before todays date
        let currentDate = new Date();
        if(currentDate.getFullYear() > Number(date[2]) || 
            ((currentDate.getMonth()+1) > Number(date[0]) && currentDate.getFullYear() === Number(date[2])) ||
            (currentDate.getDate() > Number(date[1]) && currentDate.getFullYear() === Number(date[2]) && (currentDate.getMonth()+1) === Number(date[0]))
        ){
            return false;
        }
        return true;
    });
    return eventsReturned;
}

export const getEventById = async (id) => {
    id = checkID(id, 'eventID');

    const eventsCollection = await events();
    const eventReturned = await eventsCollection.findOne({_id: ObjectId.createFromHexString(id)});

    if(!eventReturned) throw "Error: event with the given id does not exist."

    return eventReturned;
};

export const deleteEventById = async (id, userId) => {
    id = checkID(id, 'eventID');
    userId = await checkValidUser(userId);

    const eventsCollection = await events();
    const eventDeleted = await eventsCollection.findOneAndDelete(
        {_id: ObjectId.createFromHexString(id),
         eventOrganizer: userId}
        );

    if(!eventDeleted) throw "Error: event with the given id does not exist or the user doing this is not the event organizer."

    const usersCollection = await users();
    await usersCollection.findOneAndUpdate(
        {firebaseUid: eventDeleted.eventOrganizer}, 
        {$pull: {eventsMade: eventDeleted._id.toString()}}, 
        { returnDocument: "after" });

    await usersCollection.updateMany(
        {firebaseUid: {$in: eventDeleted.usersSignedUp}},
        {$pull: {eventsAttending: eventDeleted._id.toString()}}
    )

    return eventDeleted;
};

export const updateEvent = async (eventId, updateData, userId) => {
    eventId = checkID(eventId, 'Event ID');
    userId = await checkValidUser(userId);

    if(updateData === undefined) throw `Error: updateObject is undefined.`;
    if(typeof updateData !== "object" || updateData === null || Array.isArray(updateData)) throw`Error: updateObject is not an object.`;
    if(Object.keys(updateData).length === 0) throw `Error: updateObject is empty or has less than 1 key/value pair.`

    if(updateData.eventName){
        updateData.eventName = checkValidEventName(updateData.eventName, 'Event Name');
        updateData.eventName = xss(updateData.eventName);
    }
    if(updateData.sport) updateData.sport = checkValidSport(updateData.sport, 'Sport');
    if(updateData.location){
        updateData.location = checkValidLocation(updateData.location, 'Location');
        updateData.location = xss(updateData.location);
    }
    if(updateData.eventSize) updateData.eventSize = checkValidEventSize(updateData.eventSize, 'Event Size');
    if(updateData.tags) updateData.tags = checkValidTags(updateData.tags, 'tags');
    if(updateData.description){
        updateData.description = checkString(updateData.description, 'description');
        updateData.description = xss(updateData.description);
    }
    if(updateData.date) updateData.date = checkValidEventDate(updateData.date, 'Event Date');
    if(updateData.time) updateData.time = checkValidEventTime(updateData.time, 'Event Time');

    const eventsCollection = await events();
    const updatedEvent = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId), eventOrganizer: userId},
        {$set: updateData},
        {returnDocument: 'after'});

    if(!updatedEvent) throw 'Error: unable to update event with the given ID';

    return updatedEvent;
};

export const signUpUser = async (eventId, userId, eventOrganizer) => {
    eventId = checkID(eventId, 'Event Id');
    userId = await checkValidUser(userId);
    eventOrganizer = await checkValidUser(eventOrganizer);

    if(eventOrganizer === userId) throw {status: 400, message: "The User created this event, they are automatically signed up."};

    const eventsCollection = await events();
    const eventReturned = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId)},
        {$addToSet: {usersSignedUp: userId}}, 
        {returnDocument: 'after'});

        if(!eventReturned) throw {status: 404, message:'Error: unable to register user for event with the given event Id'};

    const usersCollection = await users();
    const userReturned = await usersCollection.findOneAndUpdate(
        {firebaseUid: userId},
        {$addToSet: {eventsAttending: eventId}},
        {returnDocument: 'after'}
    );

    if(!userReturned) throw {status: 404, message:'Error: unable to register user for event with the given user Id'};

    return userReturned;
};

export const unsignUpUser = async (eventId, userId, eventOrganizer) => {
    eventId = checkID(eventId, 'Event Id');
    userId = await checkValidUser(userId);
    eventOrganizer = await checkValidUser(eventOrganizer);


    if(eventOrganizer === userId) throw {status: 400, message: "The User created this event, they cannot unregister for this event."};

    const eventsCollection = await events();
    const eventReturned = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId)},
        {$pull: {usersSignedUp: userId}}, 
        {returnDocument: 'after'});

    if(!eventReturned) throw {status: 404, message:'Error: unable to unregister user for event with the given event Id'};
    
    const usersCollection = await users();
    const userReturned = await usersCollection.findOneAndUpdate(
        {firebaseUid: userId},
        {$pull: {eventsAttending: eventId}},
        {returnDocument: 'after'}
    );

    if(!userReturned) throw {status: 404, message:'Error: unable to unregister user for event with the given user Id'};

    return userReturned;
};

export const addComment = async (eventId, userId, username, comment) => {
    userId = await checkValidUser(userId);
    username = checkValidUsername(username);
    comment =  checkValidComment(comment);
    comment = xss(comment);
    eventId = checkID(eventId);

    let newComment = {
        _id: new ObjectId(),
        userId: userId,
        username: username, 
        comment: comment
    }
    const eventsCollection = await events();
    const updatedEvent = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId)},
        {$push: {comments: newComment}},
        {returnDocument: 'after'}
    )

    if(!updatedEvent) throw 'Error: unable to update event with the given ID';

    return updatedEvent;
};

export const deleteComment = async (eventId, commentId, userId) => {
    userId = await checkValidUser(userId);
    eventId = checkID(eventId, 'Event ID');
    commentId = checkID(commentId, 'Comment ID');

    const eventsCollection = await events();
    const updatedEvent = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId),
         'comments._id': ObjectId.createFromHexString(commentId),
         'comments.userId': userId   
        },
        {$pull: {comments: {_id: ObjectId.createFromHexString(commentId), userId: userId}}},
        {returnDocument: 'after'}
    );

    if(!updatedEvent) throw 'Error: unable to update event with the given ID';

    return updatedEvent;
    
};