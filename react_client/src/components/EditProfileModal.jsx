import React, { useState, useEffect } from 'react';
import '../App.css';
import ReactModal from 'react-modal';

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
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function EditProfileModal(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [profile, setProfile] = useState(props.profile);
    //get profile information from server
    //edit profile from data functions

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setProfile(null);

        props.handleClose();
    };

    let firstName;
    let lastName;
    let username;
    let dateOfBirth;
    let phoneNumber;
    let email;

    return(
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Profile'
                style={customStyles}
            >
                <form
                    className='editProfile-form'
                    id='edit-profile'
                    onSubmit={(e) => {
                        e.preventDefault();
                        

                        firstName.value = '';
                        lastName.value = '';
                        username.value = '';
                        phoneNumber.value = '';
                        email.value = '';
                        dateOfBirth.value = '';
                        setShowEditModal(false);
                        
                        alert('Profile Updated');
                        props.handleClose();
                    }}
                >
                    <div className='editProfile-form'>
                        <label>
                            First Name:
                            <br />
                            <input
                                ref={(node) => {
                                    firstName = node;
                                }}
                                defaultValue={profile.firstName}
                                autoFocus={true} 
                            />
                        </label>
                    </div>
                    <br />
                    <div className='editProfile-form'>
                        <label>
                            Last Name:
                            <br />
                            <input
                                ref={(node) => {
                                    lastName = node;
                                }}
                                defaultValue={profile.lastName}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='editProfile-form'>
                        <label>
                            Date Of Birth
                            <br />
                            <input
                                ref={(node) => {
                                    dateOfBirth = node;
                                }}
                                defaultValue={profile.dateOfBirth}
                            />
                        </label>
                    </div>
                    <div className='editProfile-form'>
                        <label>
                            Phone Number:
                            <br />
                            <input
                                ref={(node) => {
                                    phoneNumber = node;
                                }}
                                defaultValue={profile.phoneNumber}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='editProfile-form'>
                        <label>
                            Email:
                            <br />
                            <input
                                ref={(node) => {
                                    email = node;
                                }}
                                defaultValue={profile.email}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='editProfile-form'>
                        <label>
                            Username:
                            <br />
                            <input
                                ref={(node) => {
                                    username = node;
                                }}
                                defaultValue={profile.username}
                            />
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button' type='submit'>Update Profile</button>
                </form>
                <button className='button' onClick={handleCloseEditModal}>Cancel</button>
            </ReactModal>
        </div>
    );

}

export default EditProfileModal;