import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { checkDate, checkPhoneNumber, checkValidAge, checkValidUsername } from '../helpers';

function RegisterSocialSignOn() {
    const { currentUser } = useContext(AuthContext);
    const [error, setError] = useState('');
    const firebaseUid = currentUser.uid;
    let [firstName, lastName] = currentUser.displayName.split(" ");
    let email = currentUser.email.trim();
    const navigate = useNavigate();

    const checkAlreadyRegistered = async(e) => {
        const user = await axios.get(`http://localhost:3000/user/${firebaseUid}`);
        if(user.data.username !== ''){
            return navigate('/home');
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const {
            username,
            phoneNumber,
            dateOfBirth, } = e.target.elements;

        try {


            const usernameCheck = await axios.post('http://localhost:3000/user/check-username', { username: username.value }, {
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

            // const displayName = firstName.value + " " + lastName.value;
            // await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, displayName);


            const user = {
                firstName: firstName,
                lastName: lastName,
                username: username.value,
                email: email,
                phoneNumber: phoneNumber.value,
                dateOfBirth: dateOfBirth.value,
                firebaseUid: firebaseUid
            };
            const createUser = await axios.patch(`http://localhost:3000/user/${firebaseUid}`, user, {
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