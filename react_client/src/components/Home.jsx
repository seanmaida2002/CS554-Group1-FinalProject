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
  const [view, setView] = useState("otherEvents"); // State to toggle between views

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
        } else if (userInfo?.eventsAttending?.includes(event.id)) {
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
                  <h2 className="signed">
                    {event.usersSignedUp.length}/{event.eventSize}
                  </h2>
                </div>
                <h4>
                  {event.time} on {event.date}
                </h4>
                <img alt="park" src="./imgs/park.jpg" />
                <p>{event.description}</p>
                <p>Location: {event.location}</p>
                <div className="tags">
                  {event.tags.map((tag, tagIndex) => (
                    <p key={tagIndex} className="tag">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
