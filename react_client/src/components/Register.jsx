import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { UploadProfileImage } from './UploadImage';
import {getStorage, getDownloadURL, ref} from 'firebase/storage';
import { checkDate, checkValidPassword, checkPhoneNumber, checkValidAge, checkValidEmail, checkValidName, checkValidUsername } from '../helpers';

import SocialSignIn from './SocialSignIn';

function Register() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPWMatch] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    // const [imageUrl, setImageUrl] = useState(null);

    const uploadFile = async (e) => {
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setFile(URL.createObjectURL(selectedFile));
            setImage(selectedFile);
        }
    };

    const handleUpload = async () => {
        try{
            const auth = getAuth();
            const currentUser = auth.currentUser
            const url = await UploadProfileImage(image, currentUser);
            return url;
        } catch(e){
            console.log('Error uploading image:', e);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { firstName,
            lastName,
            email,
            username,
            phoneNumber,
            dateOfBirth,
            passwordOne,
            passwordTwo } = e.target.elements;

        if (passwordOne.value !== passwordTwo.value) {
            setPWMatch("Passwords Do Not Match!");
            return false;
        } else {
            setPWMatch('');
        }

        try {
            const usernameCheck = await axios.post('http://3.139.82.74:3000/user/check-username', { username: username.value }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

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
            let emailError = checkValidEmail(email.value.trim(), "Email");
            if (emailError !== email.value.trim()) {
                setError(emailError);
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
            let validPassword = checkValidPassword(passwordOne.value.trim(), "Password");
            if (validPassword !== true) {
                setError(validPassword);
                return;
            }

            const displayName = firstName.value + " " + lastName.value;
            await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, displayName);

            const auth = getAuth();
            const firebaseUid = auth.currentUser.uid;
            const imageUrl = await handleUpload();
            const imagePath = `images/userProfileImage/${firebaseUid}/${image.name}`
            const user = {
                firstName: firstName.value,
                lastName: lastName.value,
                username: username.value,
                email: email.value,
                phoneNumber: phoneNumber.value,
                dateOfBirth: dateOfBirth.value,
                imageUrl: imageUrl,
                imagePath: imagePath,
                firebaseUid: firebaseUid
            };
            const createUser = await axios.post('http://3.139.82.74:3000/user', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            

        } catch (e) {
            if (e.response && e.response.data) {
                setError(e.response.data.error);
            }
            alert(e);
        }

    };

    if (currentUser) {
        return <Navigate to='/home' replace={true} />
    }

    return (
        <div className='card'>
            <h1>Register</h1>
            <p>Already have an account? <Link to='/login' className='sign-up'>Log In</Link></p>
            {pwMatch && <h4 className='error'>{pwMatch}</h4>}
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
                        First Name:
                        <br />
                        <input className='register-form-control'
                            required name='firstName'
                            type='text'
                            placeholder='Atilla'
                            autoFocus={true} />
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Last Name:
                        <br />
                        <input className='register-form-control'
                            required
                            name='lastName'
                            type='text'
                            placeholder='Duck' />
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
                        Email:
                        <br />
                        <input className='register-form-control'
                            required name='email'
                            type='email'
                            placeholder='attila@gmail.com' />
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
                <div className='register-form'>
                    <label>
                        Password:
                        <br />
                        <input className='register-form-control'
                            id='passwordOne'
                            required name='passwordOne'
                            type='password'
                            placeholder='Password'
                            autoComplete='off' />
                    </label>
                </div>
                <br />
                <div className='register-form'>
                    <label>
                        Confirm Password:
                        <br />
                        <input className='register-form-control'
                            required name='passwordTwo'
                            type='password'
                            placeholder='Confirm Password'
                            autoCapitalize='off' />
                    </label>
                </div>
                <button
                    className='button'
                    id='submitButton'
                    name='submitButton'
                    type='submit'>
                    Register
                </button>
            </form>
            <br />
            {<SocialSignIn />}
        </div>
    );
}

export default Register;