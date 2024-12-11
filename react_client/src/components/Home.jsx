import React, { useState, useEffect, useContext } from "react";
import '../App.css';
import './Home.css';
import axios from 'axios';



function Home() {
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const getEvents = async () => {
            try {
                const data = await axios.get(`http://localhost:3000/events`);
                setEvents(data.data);
                setLoading(false);
                console.log(data.data);
            } catch (error) {
                console.log(`Error fetching events: ${error}`);
            } 
        };
        getEvents();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
        }

        if (events) {
            return (
                <div className="events">
                    {events.map((event, eventIndex) => {
                        return (
                            <div key={eventIndex} className="event-card">
                                <div className="notComment">
                                    <div className="info">
                                        <h2>{event.eventName}: {event.sport}</h2>
                                        <p>{event.description}</p>
                                        <p>Location: {event.location}</p>
                                        <p>Size: {event.eventSize}</p>
                                        <div className="tags">
                                            {event.tags.map((tag, tagIndex) => (
                                                <p key={tagIndex} className="tag">{tag}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="comments">
                                    {event.comments.map((tag, tagIndex) => (
                                        <p key={tagIndex} className="tag">{tag}</p>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
        
      

}

export default Home;