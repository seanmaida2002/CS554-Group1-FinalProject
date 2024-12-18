import { Router } from "express";
import xss from "xss";
import redis from 'redis';
import { getAllEvents, createEvent, updateEvent, getEventById, deleteEventById, signUpUser, unsignUpUser, addComment, deleteComment } from "../data/events.js";
import { checkString, checkValidEventName, checkValidComment, checkValidEventTime, checkValidEventDate, checkValidSport, checkValidEventSize, checkValidTags, checkValidLocation, checkValidUser, checkID, checkValidUserAndGetUsername } from "../helpers.js";
const router = Router();
const client = redis.createClient();
await client.connect();

router
    .route('/')
    // Route to get a list of all the events
    .get(async (req, res) => {
        try{
            const allEvents = await getAllEvents();
            await client.set('getAllEvents',  JSON.stringify(allEvents), {EX: 3600});

            return res.json(allEvents);
          }catch(e){
            return res.status(500).json({error: e});
          }
    })
    // Route to create a new event
    .post(async (req, res) => {
        let newEventData = req.body;

        if(!newEventData || Object.keys(newEventData).length === 0) return res.status(400).json({error: "The request body is empty."});
        
        try{
            newEventData.eventName = checkValidEventName(newEventData.eventName, 'Event Name');
            newEventData.eventName = xss(newEventData.eventName);
            newEventData.sport = checkValidSport(newEventData.sport, 'Sport');
            newEventData.location = checkValidLocation(newEventData.location, 'Location');
            newEventData.location = xss(newEventData.location);
            newEventData.eventSize = checkValidEventSize(newEventData.eventSize, 'Event Size');
            newEventData.date = checkValidEventDate(newEventData.date, 'Event Date');
            newEventData.eventOrganizer =  checkString(newEventData.eventOrganizer);
            newEventData.tags = checkValidTags(newEventData.tags, 'tags');
            newEventData.description = checkString(newEventData.description, 'description');
            newEventData.description = xss(newEventData.description);
            newEventData.time = checkValidEventTime(newEventData.time, 'Event Time');
        }catch(e){
            return res.status(400).json({error: e});
        }  

        try{
            newEventData.eventOrganizer =  await checkValidUser(newEventData.eventOrganizer);
        }catch(e){
            return res.status(404).json({error: e})
        }

        try{
            const{
                eventName, 
                sport, 
                location, 
                eventSize, 
                tags,
                eventOrganizer, 
                description, 
                date, 
                time,
            } = newEventData;

            const eventReturned = await createEvent(eventName, sport, location, eventSize, eventOrganizer, tags, description, date, time);

            await client.json.set(`event:{${eventReturned._id.toString()}}`,  JSON.stringify(eventReturned), {EX: 3600});

            await client.del('getAllEvents');
            return res.status(200).json(eventReturned);
        }catch(e){
            return res.status(500).json({error: e});
        }

    })

router
    .route('/:eventId')
    // Route to get an event by its Id
    .get(async (req, res) => {
        let id = req.params.eventId;
        try{
            id = checkID(id, 'event ID')
        }catch(e){
            return res.status(400).json({error: e})
        }   

        try{
            const event = await getEventById(id);

            await client.set(`event:{${id}}`,  JSON.stringify(event), {EX: 3600});

            return res.json(event);
          }catch(e){
            return res.status(404).json({error: e});
          }
    })
    // Route to delete an event by its Id
    // In body put the user who is deleting the events, firebaseUid in the body as userId
    .delete(async (req, res) => {
        let id = req.params.eventId;
        let userId = req.query.userId;
        
        try{
            id = checkID(id, 'event ID')
        }catch(e){
            return res.status(400).json({error: e})
        }   

        try{
            userId = await checkValidUser(userId);
        }catch(e){
            return res.status(404).json({error: e});
        }

        try{
            const eventDeleted = await deleteEventById(id, userId);
            await client.del(`event:{${id}}`);
            await client.del('getAllEvents');
            return res.json(eventDeleted);
          }catch(e){
            return res.status(404).json({error: e});
          }
    })
    // Route to edit an event by its Id
    // In body put the user who is editing the events, firebaseUid in the body as userId
    .patch(async (req, res) => {
        let userId = req.body.userId;
        delete req.body.userId;
        let updateData = req.body;
        let eventId = req.params.eventId;

        try{
            userId = await checkValidUser(userId);
        }catch(e){
            return res.status(404).json({error: e});
        }

        try{
            eventId = checkID(eventId, 'event ID');
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
        }catch(e){
            console.log(e);
            return res.status(400).json({error: e});
        }

        try{
            const updatedEvent = await updateEvent(eventId, updateData , userId);

            await client.set(`event:{${eventId}}`,   JSON.stringify(updatedEvent), {EX: 3600});

            await client.del('getAllEvents');
            return res.json(updatedEvent);
        }catch(e){
            return res.status(404).json({error: e});
        }

    })

// When signing up a user pass in the users firebaseUid and the event organizers firebaseUid in the body
router
    .route('/:eventId/signUpUser')
    .put(async (req, res) => {
        let eventId = req.params.eventId;
        let {userId, eventOrganizer} = req.body;

        if(eventOrganizer === userId) return res.status(400).json({message: "The User created this event, they are automatically signed up."})

        try{
            eventId = checkID(eventId, 'event ID');
            userId = checkString(userId, 'User ID');
            eventOrganizer = checkString(eventOrganizer, 'Event Organizer ID');
        }catch(e){
            return res.status(400).json({error: e});
        }
        
        try{
            userId = await checkValidUser(userId);
            eventOrganizer = await checkValidUser(eventOrganizer);
        }catch(e){
            return res.status(404).json({error: e});
        }

        try{
            const updatedUser = await signUpUser(eventId, userId, eventOrganizer);
            await client.flushAll();
            return res.json(updatedUser);
        }catch(e){
            return res.status(e.status).json({error: e.message});
        }
    });

// When unsigning up a user pass in the users firebaseUid and the event organizers firebaseUid in the body
    router
    .route('/:eventId/unsignUpUser')
    .put(async (req, res) => {
        let eventId = req.params.eventId;
        let {userId, eventOrganizer} = req.body;

        if(eventOrganizer === userId) return res.status(400).json({message: "The User created this event, they cannot unregister for this event."})


        try{
            eventId = checkID(eventId, 'event ID');
            userId = checkString(userId, 'User ID');
            eventOrganizer = checkString(eventOrganizer, 'Event Organizer ID');
        }catch(e){
            return res.status(400).json({error: e});
        }

        try{
            userId = await checkValidUser(userId);
            eventOrganizer = await checkValidUser(eventOrganizer);
        }catch(e){
            return res.status(404).json({error: e});
        }

        try{
            const updatedUser = await unsignUpUser(eventId, userId, eventOrganizer);
            await client.flushAll();
            return res.json(updatedUser);
        }catch(e){
            return res.status(404).json({error: e});
        }
    });

    // To post a comment you only need the UserId and the comment in the request body
    router
    .route('/:eventId/comments')
    .post(async (req, res) => {
        let newCommentData = req.body;
        let eventId = req.params.eventId;

        if(!newCommentData || Object.keys(newCommentData).length === 0) return res.status(400).json({error: "The request body is empty."});

        try{
            newCommentData.username = await checkValidUserAndGetUsername(newCommentData.userId)
        }catch(e){
            return res.status(404).json({error: 'No user with that User Id.'})
        }

        try{
            eventId = checkID(eventId, 'Event ID')
            newCommentData.comment = checkValidComment(newCommentData.comment);
            newCommentData.comment = xss(newCommentData.comment);
        }catch(e){
            return res.status(400).json({error: e})
        }

        try{
            let updatedEvent = await addComment(eventId, newCommentData.userId, newCommentData.username, newCommentData.comment);

            await client.set(`event:{${eventId}}`,   JSON.stringify(updatedEvent), {EX: 3600});

            await client.del('getAllEvents');
            return res.json(updatedEvent);
        }catch(e){
            return res.status(404).json({error: e});
        }
    });

    router
    .route('/:eventId/comments/:commentId')
    .delete(async (req, res) => {
        let eventId = req.params.eventId;
        let commentId = req.params.commentId;
        let userId = req.query.userId;

        try{
            eventId = checkID(eventId, 'event ID')
            commentId = checkID(commentId, 'Comment ID');
        }catch(e){
            return res.status(400).json({error: e})
        }   

        try{
            userId = await checkValidUser(userId);
        }catch(e){
            return res.status(404).json({error: e});
        }

        try{
            let updatedEvent = await deleteComment(eventId, commentId, userId);

            await client.set(`event:{${eventId}}`,   JSON.stringify(updatedEvent), {EX: 3600});

            await client.del('getAllEvents');
            return res.json(updatedEvent);
        }catch(e){  
            return res.status(404).json({error: e});
        }
        
    });

export default router;