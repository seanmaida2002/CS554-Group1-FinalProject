import { Router } from "express";
import xss from "xss";
import { getAllEvents, createEvent, getEventById, deleteEventById, updateEvent } from "../data/events.js";
import { checkString, checkValidEventName, checkValidSport, checkValidEventSize, checkValidTags, checkValidLocation, checkValidEventOrganizer, checkID } from "../helpers.js";
const router = Router();

router
    .route('/')
    // Route to get a list of all the events
    .get(async (req, res) => {
        try{
            const allEvents = await getAllEvents();
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
            newEventData.eventOrganizer =  await checkValidEventOrganizer(newEventData.eventOrganizer);
            newEventData.tags = checkValidTags(newEventData.tags, 'tags');
            newEventData.description = checkString(newEventData.description, 'description');
            newEventData.description = xss(newEventData.description);
        }catch(e){
            return res.status(400).json({error: e});
        }  

        try{
            const{
                eventName, 
                sport, 
                location, 
                eventSize, 
                tags,
                eventOrganizer, 
                description
            } = newEventData;

            const eventReturned = await createEvent(eventName, sport, location, eventSize, eventOrganizer, tags, description);
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
            return res.json(event);
          }catch(e){
            return res.status(404).json({error: e});
          }
    })
    // Route to delete an event by its Id
    .delete(async (req, res) => {
        let id = req.params.eventId;
        try{
            id = checkID(id, 'event ID')
        }catch(e){
            return res.status(400).json({error: e})
        }   

        try{
            const eventDeleted = await deleteEventById(id);
            return res.json(eventDeleted);
          }catch(e){
            return res.status(404).json({error: e});
          }
    })
    // Route to edit an event by its Id
    .patch(async (req, res) => {
        let updateData = req.body;
        let eventId = req.params.eventId;

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
            if(updateData.eventOrganizer) updateData.eventOrganizer =  await checkValidEventOrganizer(updateData.eventOrganizer);
            if(updateData.tags) updateData.tags = checkValidTags(updateData.tags, 'tags');
            if(updateData.description){
                updateData.description = checkString(updateData.description, 'description');
                updateData.description = xss(updateData.description);
            }
        }catch(e){
            return res.status(400).json({error: e});
        }

        try{
            const updatedEvent = await updateEvent(eventId, updateData);
            return res.json(updatedEvent);
        }catch(e){
            return res.status(500).json({error: e});
        }

    })

export default router;