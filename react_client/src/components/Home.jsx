import React, { useState, useEffect } from "react";
import "../App.css";
import "./Home.css";
import axios from "axios";
import { getAuth } from "firebase/auth";

function Home() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherEvents, setOtherEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [filteredSport, setFilteredSport] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [view, setView] = useState("otherEvents");
  const [del, setDel] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return;

      try {
        const data = await axios.get(`http://localhost:3000/events`);
        setEvents(data.data);
        setLoading(false);
      } catch (error) {
        console.log(`Error fetching events: ${error}`);
      }
    };
    getEvents();
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      if (!user) return;

      try {
        const data = await axios.get(`http://localhost:3000/user/${user.uid}`);
        setUserInfo(data.data);
        setLoading(false);
      } catch (error) {
        console.log(`Error fetching user info: ${error}`);
      }
    };
    getUser();
  }, [user]);

  useEffect(() => {
    if (events) {
      const myEventsTemp = [];
      const otherEventsTemp = [];
      const attendingEventsTemp = [];

      for (const event of events) {
        if (event.eventOrganizer === user.uid) {
          myEventsTemp.push(event);
        } else if (userInfo?.eventsAttending?.includes(event._id)) {
          attendingEventsTemp.push(event);
        } else {
          otherEventsTemp.push(event);
        }
      }

      setMyEvents(myEventsTemp);
      setOtherEvents(otherEventsTemp);
      setAttendingEvents(attendingEventsTemp);
    }
  }, [events, user, userInfo]);

  const filteredOtherEvents = filteredSport
    ? otherEvents.filter((event) => event.sport === filteredSport)
    : otherEvents;

  const filteredMyEvents = filteredSport
    ? myEvents.filter((event) => event.sport === filteredSport)
    : myEvents;

  const filteredAttendingEvents = filteredSport
    ? attendingEvents.filter((event) => event.sport === filteredSport)
    : attendingEvents;

  const handleFilterChange = (e) => {
    setFilteredSport(e.target.value);
  };

  const getCurrentEvents = () => {
    if (view === "myEvents") {
      return filteredMyEvents;
    }
    if (view === "attendingEvents") {
      return filteredAttendingEvents;
    }
    return filteredOtherEvents;
  };

  const handleSignUp = async (eventId, eventOrganizer) => {
    if (!user || !userInfo) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/events/${eventId}/signUpUser`,
        {
          userId: user.uid,
          eventOrganizer: eventOrganizer,
        }
      );

      setOtherEvents((prev) => prev.filter((event) => event._id !== eventId));
      alert("You are now attending the event!");
    } catch (error) {
      console.error(`Error signing up for event: ${error.message}`);
    }
  };

  const handleUnsignUp = async (eventId, eventOrganizer) => {
    if (!user || !userInfo) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/events/${eventId}/unsignUpUser`,
        {
          userId: user.uid,
          eventOrganizer: eventOrganizer,
        }
      );

      setAttendingEvents((prev) =>
        prev.filter((event) => event._id !== eventId)
      );
      alert("You are no longer attending the event!");
    } catch (error) {
      console.error(`Error signing up for event: ${error.message}`);
    }
  };
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `http://localhost:3000/events/${eventId}?userId=${user.uid}`
      );
      setMyEvents((prev) => prev.filter((event) => event._id !== eventId));
      setDel(false);
      alert("Event Deleted");
    } catch (error) {
      console.error(`Error deleting event: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Please log in to view events.</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="filter">
        <label htmlFor="sport-filter">Filter by Sport: </label>
        <select
          id="sport-filter"
          value={filteredSport}
          onChange={handleFilterChange}
        >
          <option value="">All Sports</option>
          <option value="Soccer">Soccer</option>
          <option value="Basketball">Basketball</option>
          <option value="Tennis">Tennis</option>
          <option value="Baseball">Baseball</option>
          <option value="Hockey">Hockey</option>
          <option value="Volleyball">Volleyball</option>
          <option value="Football">Football</option>
          <option value="Pickleball">Pickleball</option>
        </select>
      </div>

      <div className="view-buttons">
        <button
          className={view === "otherEvents" ? "active" : ""}
          onClick={() => setView("otherEvents")}
        >
          Join Events
        </button>
        <button
          className={view === "attendingEvents" ? "active" : ""}
          onClick={() => setView("attendingEvents")}
        >
          Attending Events
        </button>
        <button
          className={view === "myEvents" ? "active" : ""}
          onClick={() => setView("myEvents")}
        >
          My Events
        </button>
      </div>

      <div className="events">
        {getCurrentEvents().map((event, eventIndex) => (
          <div key={eventIndex} className="event-card">
            <div className="notComment">
              <div className="info">
                <div className="title">
                  <h2>
                    {event.eventName}: {event.sport}
                  </h2>
                  <div
                    className="signed"
                    onClick={() => {
                      const isSignedUp = attendingEvents.some(
                        (e) => e._id === event._id
                      );
                      const myEvent = event.eventOrganizer === user.uid;
                      if (isSignedUp && !myEvent) {
                        handleUnsignUp(event._id, event.eventOrganizer);
                        event.usersSignedUp = event.usersSignedUp.filter(
                          (id) => id != user.uid
                        );
                        otherEvents.push(event);
                      } else if (!myEvent) {
                        handleSignUp(event._id, event.eventOrganizer);
                        event.usersSignedUp.push(user.uid);
                        attendingEvents.push(event);
                      }
                    }}
                  >
                    {event.usersSignedUp.length}/{event.eventSize}
                  </div>
                </div>
                <h4>
                  {event.time} on {event.date}
                </h4>
                <img alt="park" src="./imgs/park.jpg" />
                <p>{event.description}</p>
                <p>Location: {event.location}</p>
                {view === "myEvents" && !del && (
                  <button
                    className="delete-button"
                    onClick={() => setDel(true)}
                  >
                    Delete Event
                  </button>
                )}
                {del && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Confirm Delete
                  </button>
                )}
                {del && (
                  <button
                    className="delete-button"
                    onClick={() => setDel(false)}
                  >
                    Cancel
                  </button>
                )}
                <div className="tags">
                  {event.tags.map((tag, tagIndex) => (
                    <p key={tagIndex} className="tag">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="comments">
              <h3>Comments</h3>
              {event.comments.map((com, comIndex) =>{
                <p key={comIndex}>{com.username}: {com.comment}</p>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
