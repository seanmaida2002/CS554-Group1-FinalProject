import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkDate, checkPhoneNumber, checkValidAge, checkValidUsername } from '../helpers';
import { UploadProfileImage } from './UploadImage';

function RegisterSocialSignOn() {
    const { currentUser } = useContext(AuthContext);
    const [error, setError] = useState('');
    const firebaseUid = currentUser.uid;
    let [firstName, lastName] = currentUser.displayName.split(" ");
    let email = currentUser.email.trim();
    const navigate = useNavigate();
    const [file, setFile] = useState();
    const [image, setImage] = useState('');

    const checkAlreadyRegistered = async (e) => {
        const user = await axios.get(`http://3.15.141.91:3000/user/${firebaseUid}`);
        if (user.data.username !== '') {
            return navigate('/home');
        }
    }

    const uploadFile = async (e) => {
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setFile(URL.createObjectURL(selectedFile));
            setImage(selectedFile);
        }
    };

    const handleUpload = async () => {
        try{
            const url = await UploadProfileImage(image, currentUser);
            return url;
        } catch(e){
            console.log('Error uploading image:', e);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const {
            username,
            phoneNumber,
            dateOfBirth, } = e.target.elements;

        try {


            const usernameCheck = await axios.post('http://3.15.141.91:3000/user/check-username', { username: username.value }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            //Error Checking
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
            let usernameError = checkValidUsername(username.value.trim());
            if (usernameError !== username.value.trim()) {
                setError(usernameError);
                return;
            }
            let validAge = checkValidAge(dateOfBirth.value.trim(), "Date of Birth");
            if (validAge !== true) {
                setError(validAge);
                return;
            }

            const imageUrl = await handleUpload();
            const imagePath = `images/userProfileImage/${firebaseUid}/${image.name}`

            const user = {
                firstName: firstName,
                lastName: lastName,
                username: username.value,
                email: email,
                phoneNumber: phoneNumber.value,
                dateOfBirth: dateOfBirth.value,
                imageUrl: imageUrl,
                imagePath: imagePath,
                firebaseUid: firebaseUid
            };
            const createUser = await axios.patch(`http://3.15.141.91:3000/user/${firebaseUid}`, user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/home');



        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.error);
            }
        }

    };

    checkAlreadyRegistered();



    return (
        <div className='card'>
            <h1>Register</h1>
            {error && <h4 className='error'>{error}</h4>}
            <form onSubmit={handleSignUp}>
                <div className='register-profile-picture-wrapper'>
                    <label>Profile Picture:</label>
                    <input type='file' accept='image/jpeg, image/png, image/jpg' multiple={false} onChange={uploadFile} />
                    <br />
                    <br />
                    <div className='register-profile-picture-container'>
                        <img className='register-profile-picture' src={file} alt='Profile Picture' />
                    </div>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        First Name: {firstName}
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Last Name: {lastName}
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Date of Birth:
                        <br />
                        <input className='register-form-control'
                            required name='dateOfBirth'
                            type='text'
                            placeholder='MM/YY/YYY' />
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Phone Number:
                        <br />
                        <input className='register-form-control'
                            required name='phoneNumber'
                            type='text'
                            placeholder='Phone Number' />
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Email: {email}
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Username:
                        <br />
                        <input className='register-form-control'
                            required name='username'
                            type='text'
                            placeholder='atilla2024' />
                    </label>
                </div>
                <br />
                <button
                    className='button'
                    id='submitButton'
                    name='submitButton'
                    type='submit'>
                    Register
                </button>
            </form>
            <br />
        </div>
    );
}

export default RegisterSocialSignOn;