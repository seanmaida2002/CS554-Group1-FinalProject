import { events, users } from "../config/mongoCollections.js";
import xss from "xss";
import { checkString, checkID, checkValidEventName, checkValidEventDate, checkValidSport, checkValidEventSize, checkValidTags, checkValidLocation, checkValidUser, checkValidEventTime } from "../helpers.js";
import { ObjectId } from "mongodb";

export const createEvent = async (eventName, sport, location, eventSize, eventOrganizer, tags, description, date, time /*, image */) => {
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
        // image: image, 
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
    
    return evenstArray;
}

export const getEventById = async (id) => {
    id = checkID(id, 'eventID');

    const eventsCollection = await events();
    const eventReturned = await eventsCollection.findOne({_id: ObjectId.createFromHexString(id)});

    if(!eventReturned) throw "Error: event with the given id does not exist."

    return eventReturned;
};

export const deleteEventById = async (id) => {
    id = checkID(id, 'eventID');

    const eventsCollection = await events();
    const eventDeleted = await eventsCollection.findOneAndDelete({_id: ObjectId.createFromHexString(id)});

    if(!eventDeleted) throw "Error: event with the given id does not exist."

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

export const updateEvent = async (eventId, updateData) => {
    eventId = checkID(eventId, 'Event ID');

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
    if(updateData.eventOrganizer) updateData.eventOrganizer =  await checkValidUser(updateData.eventOrganizer);
    if(updateData.tags) updateData.tags = checkValidTags(updateData.tags, 'tags');
    if(updateData.description){
        updateData.description = checkString(updateData.description, 'description');
        updateData.description = xss(updateData.description);
    }
    if(updateData.date) updateData.date = checkValidEventDate(updateData.date, 'Event Date');
    if(updateData.time) updateData.time = checkValidEventTime(updateData.time, 'Event Time');

    const eventsCollection = await events();
    const updatedEvent = await eventsCollection.findOneAndUpdate(
        {_id: ObjectId.createFromHexString(eventId)},
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