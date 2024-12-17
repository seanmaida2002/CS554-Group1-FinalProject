import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { checkDate } from '../helpers';
import { UploadEventImage } from './EventImage';

ReactModal.setAppElement('#root');
const loadMagick = async () => {
  if (!window.magick) {
    const Magick = await import('https://knicknic.github.io/wasm-imagemagick/magickApi.js');
    window.magick = Magick;
  }
  return window.magick;
};
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
};

function CreateEventModal(props) {
  const [showCreateModal, setShowCreateModal] = useState(props.isOpen);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    eventName: '',
    sport: '',
    location: '',
    date: '',
    time: '',
    eventSize: '',
    tags: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    props.handleClose();
  };
  const uploadFile = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setError('Please upload a valid image file.');
      return;
    }
  
    if (!uploadedFile.type.startsWith('image/')) {
      setError('File must be an image.');
      return;
    }
    setImage(uploadedFile);
  
    try {
      const Magick = await loadMagick();
      const reader = new FileReader();
  
      reader.onload = async () => {
        const inputBuffer = new Uint8Array(reader.result);
        const inputFileName = 'input.jpg';
        const outputFileName = 'output.jpg';
  
        const result = await Magick.execute({
          inputFiles: [{ name: inputFileName, content: inputBuffer }],
          commands: ['convert', inputFileName, '-quality', '75', outputFileName],
        });
  
        if (result.outputFiles.length > 0) {
          const outputBlob = new Blob([result.outputFiles[0].content], { type: 'image/jpeg' });
          const outputURL = URL.createObjectURL(outputBlob);
          setFile(outputURL);
        }
      };
  
      reader.readAsArrayBuffer(uploadedFile);
    } catch (err) {
      console.error('ImageMagick Error:', err);
      setError('Failed to process the image.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!checkData()) return;
  
    const auth = getAuth();
    const firebaseUid = auth.currentUser?.uid;
  
    if (!firebaseUid) {
      setError('Firebase user authentication failed.');
      return;
    }
  
    try {
      const createEventData = {
        ...data,
        eventSize: Number(data.eventSize),
        tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
        eventOrganizer: firebaseUid,
      };
      const response = await axios.post('http://localhost:3000/events/', createEventData);
      const createdEvent = response.data;
      const id = createdEvent._id;
      if (image) {
        const imageUrl = await UploadEventImage(image, createdEvent);
        if (!imageUrl) throw new Error('Image upload failed.');
        const patchData = {
          userId: firebaseUid,
          imageUrl: imageUrl,
        };
        const patchResponse = await axios.patch(`http://localhost:3000/events/${id}`, patchData);
      }
  
      alert('Event Created Successfully!');
      handleCloseCreateModal();
      window.location.reload();
    } catch (err) {
      console.error('Error during event creation:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error creating or updating the event.');
    }
  };
  

  const checkData = () => {
    let { eventName, sport, location, date, eventSize, tags, description } = data;
    
    if (typeof eventName !== 'string' || eventName.trim() === '') {
        setError('Invalid Event Name');
        return false;
    }
    if (eventName.trim().length > 50) {
        setError('Event name must be at most 50 characters');
        return false;
    }
    if (typeof sport !== 'string' || sport.trim() === '') {
        setError('Invalid Sport');
        return false;
    }
    if (sport.trim().length > 50) {
        setError('Sport must be at most 50 characters');
        return false;
    }
    if (typeof location !== 'string' || location.trim() === '') {
        setError('Invalid Location');
        return false;
    }
    if (location.trim().length > 100) {
        setError('Location must be at most 100 characters');
        return false;
    }
    let dateCheck = checkDate(date, 'Date');
    if (!date || dateCheck !== date) {
        setError(dateCheck || 'Invalid Date');
        return false;
    }
    if (typeof Number.parseInt(eventSize) !== 'number' || eventSize <= 0) {
        setError('Invalid Event Size');
        return false;
    }
    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim());
      if (tagArray.length > 5) {
          setError('You can only add up to 5 tags for each event');
          return false;
      }
      for (let tag of tagArray) {
          if (typeof tag !== 'string' || tag === '') {
              setError('Each tag must be a non-empty string');
              return false;
          }
          if (tag.length > 20) {
              setError('Each tag can only be up to 20 characters');
              return false;
          }
      }
  }
    if (typeof description !== 'string' || description.trim() === '') {
        setError('Invalid Description');
        return false;
    }
    if (description.trim().length > 250) {
        setError('Description must be at most 250 characters');
        return false;
    }
    
    setError('');
    return true;
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
          value={data.eventName || ''}
          onChange={(e) => setData({ ...data, eventName: e.target.value })}
        />
        </label>
      </div>
      <div>
        <label>
          Sport:
          <select id="sport"
          value={data.sport || ''}
          onChange={(e) => setData({ ...data, sport: e.target.value })}>
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
          value={data.date || ''}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Time:
          <select id="time"
          value={data.time || ''}
          onChange={(e) => setData({ ...data, time: e.target.value })}>
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
          Location "address, town, state(abbreviated) zipcode":
          <input
          type="text"
          id="location"
          value={data.location || ''}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Event Size:
          <input
          type="number"
          id="eventSize"
          value={data.eventSize || ''}
          onChange={(e) => setData({ ...data, eventSize: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Tags (please enter tags seperated by commas):
          <input
          type="text"
          id="tags"
          value={data.tags || ''}
          onChange={(e) => setData({ ...data, tags: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
          type="text"
          id="description"
          value={data.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>Upload Event Image:
          <input type="file" accept="image/*" onChange={uploadFile} />
        </label>
        {file && <img src={file} alt="Preview" style={{ 
        maxWidth: '300px', 
        maxHeight: '200px', 
        objectFit: 'cover', 
        borderRadius: '10px', 
        marginTop: '10px' 
    }}  />}
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
export default CreateEventModal;
