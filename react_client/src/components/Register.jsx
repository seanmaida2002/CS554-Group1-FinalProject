import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuth, validatePassword } from 'firebase/auth';
import { UploadProfileImage } from './UploadImage';
import { checkDate, checkValidPassword, checkPhoneNumber, checkValidAge, checkValidEmail, checkValidName, checkValidUsername } from '../helpers';

import SocialSignIn from './SocialSignIn';

function Register() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPWMatch] = useState('');
    const [error, setError] = useState({});
    const [firebaseError, setFirebaseError] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState('');

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
        
        let errors = {};
        setError({});
        setPWMatch('');
        setFirebaseError('');

        if (!image) {
            errors.image = 'Please upload a profile picture';
        }

        if (passwordOne.value !== passwordTwo.value) {
            setPWMatch("Passwords Do Not Match!");
            return false;
        } else {
            setPWMatch('');
        }

        try {
            const usernameCheck = await axios.post('http://3.22.68.13:3000/user/check-username', { username: username.value.trim() }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const emailCheck = await axios.post('http://3.22.68.13:3000/user/check-email', {email: email.value.trim()}, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            if(emailCheck.data.error){
                errors.email = emailCheck.data.error ;
            }

            //Error Checking
            let firstNameError = checkValidName(firstName.value.trim(), 'First Name')
            if (firstNameError !== firstName.value.trim()) {
                errors.firstName = firstNameError;
            }
            let lastNameError= checkValidName(lastName.value.trim(), 'Last Name');
            if (lastNameError !== lastName.value.trim()) {
                errors.lastName = lastNameError;
            }
            let dateOfBirthError = checkDate(dateOfBirth.value.trim(), "Date of Birth");
            if (dateOfBirthError !== dateOfBirth.value.trim()) {
                errors.dateOfBirth = dateOfBirthError;
            }
            let phoneNumberError = checkPhoneNumber(phoneNumber.value.trim(), "Phone Number");
            if (phoneNumberError !== phoneNumber.value.trim()) {
                errors.phoneNumber = phoneNumberError;
            }
            let emailError = checkValidEmail(email.value.trim(), "Email");
            if (emailError !== email.value.trim()) {
                errors.email = emailError;
            }
            let usernameError = checkValidUsername(username.value.trim());
            if (usernameError !== username.value.trim()) {
                errors.username = usernameError;
            }
            let validAge = checkValidAge(dateOfBirth.value.trim(), "Date of Birth");
            if (validAge !== true) {
                errors.validAge = validAge;
            }
            let validPassword = checkValidPassword(passwordOne.value.trim(), "Password");
            if (validPassword !== true) {
                errors.validPassword = validPassword;
            }

            if(Object.keys(errors).length > 0){
                setError(errors);
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
            const createUser = await axios.post('http://3.22.68.13:3000/user', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });



        } catch (e) {
            if (e.response && e.response.data) {
                setFirebaseError(e.response.data.error);
                return;
            }
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
            {error.validAge && <h4 className='error'>{error.validAge}</h4>}
            {error.image && <h4 className='error'>{error.image}</h4>}
            {firebaseError && <h4 className='error'>{firebaseError}</h4>}
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
                    {error.firstName && <h4 className='error'>{error.firstName}</h4>}
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
                    {error.lastName && <h4 className='error'>{error.lastName}</h4>}
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
                    {error.dateOfBirth && <h4 className='error'>{error.dateOfBirth}</h4>}
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
                    {error.phoneNumber && <h4 className='error'>{error.phoneNumber}</h4>}
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
                    {error.email && <h4 className='error'>{error.email}</h4>}
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
                    {error.username && <h4 className='error'>{error.username}</h4>}
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
                    {error.validPassword && <h4 className='error'>{error.validPassword}</h4>}
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