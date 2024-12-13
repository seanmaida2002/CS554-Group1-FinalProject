import React, { useState, useEffect } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { checkDate } from '../helpers';


ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '2px solid #c2e7ff',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

const buttonStyles = {
    padding: '20px 40px',
    fontSize: '20px',
    border: 'none',
    backgroundColor: '#c2e7ff',
    color: 'black',
    cursor: 'pointer',
    borderRadius: '30px',
    transition: 'background-color 0.3s ease',
};

const buttonHoverStyles = {
    backgroundColor: '#004080', 
    color: 'white', 
}
function CreateEventModal(props){
    const [showCreateModal, setShowCreateModal] = useState(props.isOpen);
    const [data, setData] = useState({
        eventName:'',
        sport:'',
        location:'',
        date:'',
        time:'',
        eventSize:'',
        tags:'',
        description:''
    });
    const [error, setError] = useState('');

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        props.handleClose();
    };

    const checkData = () =>{
        let { eventName, sport, location, date, eventSize, tags, description } = data
        if(typeof eventName !== 'string' || eventName.trim() == '' ){
            setError('Invalid Event Name')
            return
        }
        if(typeof sport !== 'string' || sport.trim() == '' ){
            setError('Invalid Sport')
            return
        }
        if(typeof location !== 'string' || location.trim() == '' ){
            setError('Invalid Location')
            return
        }
        let dateCheck = checkDate(date,'Date');
        if(!date || dateCheck !== date ){
            return dateCheck;
        }
        if(typeof date !== 'string')
        if(typeof eventSize !== 'number' || eventSize == 0 ){
            setError('Invalid Event Size')
            return
        }
        if(tags){
            if (Array.isArray(tags)) {
              for (let i = 0; i < tags.length; i++) {
                if (typeof tags[i] !== 'string' || !tags[i].trim()) {
                  setError("Each tag must be a non-empty string");
                  return
                }
                tags[i] = tags[i].trim();
              }
            } else {
              setError("tags must be an array of strings");
              return
            }
          }
        if(typeof description !== 'string' || description.trim() == '' ){
            setError('Invalid Description')
            return
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = checkData();
        if(errors){
            setError(errors);
            return
        }

            const auth = getAuth();
            const firebaseUid = auth.currentUser?.uid;
            if(!firebaseUid){
                setError('Error with firebase user id')
                return
            }

            let eventName = document.getElementById('eventName').value;
            let sport = document.getElementById('sport').value;
            let location = document.getElementById('location').value;
            let date = document.getElementById('date').value;
            let time = document.getElementById('time').value;
            let eventSize = Number(document.getElementById('eventSize').value);
            let tags = document.getElementById('tags').value.split(',').map((tag) => tag.trim());
            let description =  document.getElementById('description').value;
            try {
                const response = await axios.post('http://localhost:3000/events/', {
                  eventName: eventName,
                  sport: sport,
                  location: location,
                  eventSize: eventSize,
                  tags: tags,
                  eventOrganizer: firebaseUid,
                  description: description,
                  date: date ,
                  time: time
                });
                alert ('Event Created!');
                handleCloseCreateModal();
    }catch(e){
        setError(e.response?.data?.message || 'Could not create event')
    }
};
    return (
        <div>
            <ReactModal
        name="createEventModal"
        isOpen={props.isOpen}
        contentLabel="Create Event"
        style={customStyles}
        onRequestClose={handleCloseCreateModal}
      >
        <form className="createEvent-form" onSubmit={handleSubmit}>
          {error && <h4 className="error">{error}</h4>}
          <div>
            <label>
              Event Name:
            <input
            type="text"
            id="eventName"
            autoFocus
            />
            </label>
          </div>
          <div>
            <label>
              Sport:
              <select id="sport">
                <option value="">Please choose a sport!</option>
                <option value="Soccer">Soccer</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Baseball">Baseball</option>
                <option value="Hockey">Hockey</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Football">Football</option>
                <option value="Pickleball">Pickleball</option>
                </select>
            </label>
          </div>
          <div>
            <label>
              Date (please enter in format MM/DD/YYYY):
              <input
                type="text"
                id="date"
              />
            </label>
          </div>
          <div>
            <label>
              Time:
              <select id="time">
                <option value="">Select a time!</option>
                <option value="12:00 AM">12:00 AM</option>
                <option value="12:15 AM">12:15 AM</option>
                <option value="12:30 AM">12:30 AM</option>
                <option value="12:45 AM">12:45 AM</option>
                <option value="01:00 AM">01:00 AM</option>
                <option value="01:15 AM">01:15 AM</option>
                <option value="01:30 AM">01:30 AM</option>
                <option value="01:45 AM">01:45 AM</option>
                <option value="02:00 AM">02:00 AM</option>
                <option value="02:15 AM">02:15 AM</option>
                <option value="02:30 AM">02:30 AM</option>
                <option value="02:45 AM">02:45 AM</option>
                <option value="03:00 AM">03:00 AM</option>
                <option value="03:15 AM">03:15 AM</option>
                <option value="03:30 AM">03:30 AM</option>
                <option value="03:45 AM">03:45 AM</option>
                <option value="04:00 AM">04:00 AM</option>
                <option value="04:15 AM">04:15 AM</option>
                <option value="04:30 AM">04:30 AM</option>
                <option value="04:45 AM">04:45 AM</option>
                <option value="05:00 AM">05:00 AM</option>
                <option value="05:15 AM">05:15 AM</option>
                <option value="05:30 AM">05:30 AM</option>
                <option value="05:45 AM">05:45 AM</option>
                <option value="06:00 AM">06:00 AM</option>
                <option value="06:15 AM">06:15 AM</option>
                <option value="06:30 AM">06:30 AM</option>
                <option value="06:45 AM">06:45 AM</option>
                <option value="07:00 AM">07:00 AM</option>
                <option value="07:15 AM">07:15 AM</option>
                <option value="07:30 AM">07:30 AM</option>
                <option value="07:45 AM">07:45 AM</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="08:15 AM">08:15 AM</option>
                <option value="08:30 AM">08:30 AM</option>
                <option value="08:45 AM">08:45 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:15 AM">09:15 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="09:45 AM">09:45 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:15 AM">10:15 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="10:45 AM">10:45 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:15 AM">11:15 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:15 PM">12:15 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="12:45 PM">12:45 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:15 PM">01:15 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="01:45 PM">01:45 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:15 PM">02:15 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="02:45 PM">02:45 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:15 PM">03:15 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="03:45 PM">03:45 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:15 PM">04:15 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="05:15 PM">05:15 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="05:45 PM">05:45 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="06:15 PM">06:15 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="06:45 PM">06:45 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="07:15 PM">07:15 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="07:45 PM">07:45 PM</option>
                <option value="08:00 PM">08:00 PM</option>
                <option value="08:15 PM">08:15 PM</option>
                <option value="08:30 PM">08:30 PM</option>
                <option value="08:45 PM">08:45 PM</option>
                <option value="09:00 PM">09:00 PM</option>
                <option value="09:15 PM">09:15 PM</option>
                <option value="09:30 PM">09:30 PM</option>
                <option value="09:45 PM">09:45 PM</option>
                <option value="10:00 PM">10:00 PM</option>
                <option value="10:15 PM">10:15 PM</option>
                <option value="10:30 PM">10:30 PM</option>
                <option value="10:45 PM">10:45 PM</option>
                <option value="11:00 PM">11:00 PM</option>
                <option value="11:15 PM">11:15 PM</option>
                <option value="11:30 PM">11:30 PM</option>
                <option value="11:45 PM">11:45 PM</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                type="text"
                id="location"
              />
            </label>
          </div>
          <div>
            <label>
              Event Size:
              <input
                type="number"
                id="eventSize"
              />
            </label>
          </div>
          <div>
            <label>
              Tags (please enter tags seperated by commas):
              <input
                type="text"
                id="tags"
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                id="description"
              />
            </label>
          </div>
          <button type="submit"
          style={buttonStyles}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyles.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyles.backgroundColor)}
          >Create Event</button>
          <button type="button" onClick={handleCloseCreateModal}
          style={buttonStyles}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyles.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyles.backgroundColor)}
          >Cancel</button>
        </form>
      </ReactModal>
    </div>
  );
}
export default CreateEventModal