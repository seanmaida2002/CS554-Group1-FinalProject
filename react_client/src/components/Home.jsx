import React, { useState, useEffect } from "react";
import "../App.css";
import "./Home.css";
import axios from "axios";
import { getAuth } from "firebase/auth";
import EditEventModal from "./EditEvent";

function Home() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherEvents, setOtherEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [filteredSport, setFilteredSport] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [view, setView] = useState("myEvents");
  const [del, setDel] = useState(false);
  const [delId, setDelId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newComment, setNewComment] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const closeEditFormState = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return;

      try {
        const data = await axios.get(`http://3.139.82.74:3000/events`);
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
        const data = await axios.get(`http://3.139.82.74:3000/user/${user.uid}`);
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
        `http://3.139.82.74:3000/events/${eventId}/signUpUser`,
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
        `http://3.139.82.74:3000/events/${eventId}/unsignUpUser`,
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
        `http://3.139.82.74:3000/events/${eventId}?userId=${user.uid}`
      );
      setMyEvents((prev) => prev.filter((event) => event._id !== eventId));
      setDelId(null);
      setDel(false);
      alert("Event Deleted");
    } catch (error) {
      console.error(`Error deleting event: ${error.message}`);
    }
  };

  const handleCommentChange = (eventId, value) => {
    setNewComment((prev) => ({ ...prev, [eventId]: value }));
  };

  const handleDeleteComment = async (eventId, commentId) => {
    if (!user) return;

    try {
      const response = await axios.delete(
        `http://3.139.82.74:3000/events/${eventId}/comments/${commentId}?userId=${user.uid}`
      );

      // Update the event comments locally
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, comments: response.data.comments }
            : event
        )
      );

      alert("Comment deleted successfully!");
    } catch (error) {
      console.error(`Error deleting comment: ${error.message}`);
    }
  };

  const handleAddComment = async (eventId, username) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `http://3.139.82.74:3000/events/${eventId}/comments`,
        {
          userId: user.uid,
          username: username,
          comment: newComment[eventId]
        }
      );

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, comments: response.data.comments }
            : event
        )
      );

      setNewComment((prev) => ({ ...prev, [eventId]: "" }));
    } catch (error) {
      console.error(`Error adding comment: ${error.message}`);
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
                  <div className="titleAndLocation">
                    <h2>
                      {event.eventName}: {event.sport}
                    </h2>
                    <h4>
                      {event.time} on {event.date}
                    </h4>
                  </div>
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
                <img alt="Event Image" src= {event.imageUrl}/>
                <p>{event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <div className="myButtons">
                  {view === "myEvents" && delId != event._id && (
                    <div>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setShowEditForm(!showEditForm);
                          setSelectedEvent(event);
                        }}
                        style={{
                          padding: "20px 40px",
                          fontSize: "20px",
                          border: "none",
                          backgroundColor: "#c2e7ff",
                          color: "black",
                          cursor: "pointer",
                          borderRadius: "30px",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#004080")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#c2e7ff")
                        }
                      >
                        Edit Event
                      </button>

                      {showEditForm && (
                        <EditEventModal
                          isOpen={showEditForm}
                          handleClose={closeEditFormState}
                          eventData={selectedEvent}
                        />
                      )}
                    </div>
                  )}

                  {view === "myEvents" && delId != event._id && (
                    <button
                      className="delete-button"
                      onClick={() => {
                        setDel(true);
                        setDelId(event._id);
                      }}
                    >
                      Delete Event
                    </button>
                  )}
                  {del && delId == event._id && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Confirm Delete
                    </button>
                  )}
                  {del && delId == event._id && (
                    <button
                      className="delete-button"
                      onClick={() => {
                        setDel(false);
                        setDelId(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
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
              <h3>Comments:</h3>
              {event.comments.map((com, index) => (
                <div key={index} className="comment-item">
                  <p>
                    <strong>{com.username}</strong>: {com.comment}
                  </p>
                  {com.userId === user.uid && (
                    <button
                      className="delete-comment-button"
                      onClick={() => handleDeleteComment(event._id, com._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
              <div className="addCommentDiv">
                <input
                  type="text"
                  className="add"
                  placeholder="Add a comment"
                  value={newComment[event._id] || ""}
                  onChange={(e) => handleCommentChange(event._id, e.target.value)}
                />
                <button
                  onClick={() => handleAddComment(event._id, userInfo?.username)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
