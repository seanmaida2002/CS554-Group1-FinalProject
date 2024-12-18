import React, { useState } from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { checkDate, checkPhoneNumber, checkValidAge, checkValidEmail, checkValidName, checkValidUsername } from '../helpers';
import { UploadProfileImage, DeleteProfileImage } from './UploadImage';

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
    const [error, setError] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const auth = getAuth();
    const firebaseUid = auth.currentUser.uid;
    //get profile information from server
    //edit profile from data functions

    const uploadFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile));
            setImage(selectedFile);
        }
    };

    const handleUpload = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser
            const url = await UploadProfileImage(image, currentUser);
            return url;
        } catch (e) {
            console.log('Error uploading image:', e);
        }
    };

    const handleDeleteImage = (imagePath) => {
        try {
            const currentUser = auth.currentUser;
            const deleteImage = DeleteProfileImage(currentUser, imagePath);
        } catch (e) {
            console.log('Error deleting image:', e);
        }
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //Error Checking
            let firstNameError = checkValidName(firstName.value.trim(), 'First Name')
            if (firstNameError !== firstName.value.trim()) {
                setError(firstNameError);
                return;
            }
            let lastNameError = checkValidName(lastName.value.trim(), 'Last Name');
            if (lastNameError !== lastName.value.trim()) {
                setError(lastNameError);
                return;
            }
            let dobError = checkDate(dateOfBirth.value.trim(), "Date of Birth");
            if (dobError !== dateOfBirth.value.trim()) {
                setError(dobError);
                return;
            }
            let phoneNumberError = checkPhoneNumber(phoneNumber.value.trim(), "Phone Number");
            if (phoneNumberError !== phoneNumber.value.trim()) {
                setError(phoneNumberError);
                return;
            }
            if (username.value.trim() !== profile.username) {
                let usernameError = checkValidUsername(username.value.trim());
                if (usernameError !== username.value.trim()) {
                    setError(usernameError);
                    return;
                }
                const usernameCheck = await axios.post('http://3.22.68.13:3000/user/check-username', { username: username.value }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            let validAge = checkValidAge(dateOfBirth.value.trim(), "Date of Birth");
            if (validAge !== true) {
                setError(validAge);
                return;
            }

            let newImageUrl = profile.imageUrl;
            if (image) {
                if (profile.imageUrl) {
                    const user = await axios.get(`http://3.22.68.13:3000/user/${auth.currentUser.uid}`)
                    const imagePath = user.data.imagePath;
                    handleDeleteImage(imagePath);
                }
                newImageUrl = await handleUpload();
            }
            const imagePath = `images/userProfileImage/${auth.currentUser.uid}/${image.name}`;

            const updateProfile = {
                firstName: firstName.value,
                lastName: lastName.value,
                username: username.value,
                phoneNumber: phoneNumber.value,
                dateOfBirth: dateOfBirth.value,
                imageUrl: newImageUrl,
                imagePath: imagePath
            };

            setError('');

            auth.currentUser.displayName = firstName.value + " " + lastName.value;
            const update = await axios.patch(`http://3.22.68.13:3000/user/${firebaseUid}`, updateProfile);

            alert("Profile Updated Successfully");
            props.onProfileUpdate(update.data);
            setProfile(update.data);
            handleCloseEditModal();
        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.error);
            }
        }
    };


    return (
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
                    <div className='edit-profile-picture-wrapper'>
                        <label>Change Profile Picture:</label>
                        <input type='file' accept='image/jpeg, image/png, image/jpg' multiple={false} onChange={uploadFile} />
                        <br />
                        <br />
                        <div className='edit-profile-picture-container'>
                            <img className='edit-profile-picture' src={file} alt='Profile Picture' />
                        </div>
                    </div>
                    <br />
                    <div className='editProfile-form'>
                        {error && <h4 className='error'>{error}</h4>}
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
                    <br />
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
                    {/* <br /> */}
                    {/* <div className='editProfile-form'>
                        {auth.currentUser.providerData[0].providerId === 'password' ?
                            (
                                <label>
                                    Email:
                                    <br />
                                    <input style={{ display: "none" }}
                                        ref={(node) => {
                                            email = node;
                                        }}
                                        defaultValue={profile.email}
                                    />
                                </label>
                            ) :
                            (
                                <label>
                                    Email: {profile.email}
                                    <input style={{ display: "none" }}
                                        ref={(node) => {
                                            email = node;
                                        }}
                                        defaultValue={profile.email}
                                    />
                                    <p style={{ fontSize: 'x-small' }}>You are signed in with Google. You can't change your email</p>
                                </label>
                            )
                        }
                    </div> */}
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
                    <button className='changePassword-button' onClick={handleSubmit} type='submit'>Update Profile</button>
                </form>
                <button className='button' onClick={handleCloseEditModal}>Cancel</button>
            </ReactModal>
        </div>
    );


}

export default EditProfileModal;