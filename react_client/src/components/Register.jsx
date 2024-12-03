import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';

import SocialSignIn from './SocialSignIn';

function Register() {
    const {currentUser} = useContext(AuthContext);
    const [pwMatch, setPWMatch] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        const {displayName, email, passworOne, passwordTwo} = e.target.elements;

        if(passwordOne.value !== passwordTwo.value){
            setPWMatch("Passwords do not Match!");
            return false;
        } else{
            setPWMatch('');
        }

        try{
            await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, displayName.value);
        } catch(e){
            alert(e);
        }
    };

    if(currentUser){
        return <Navigate to='/home' replace={true} />
    }

    return (
        <div className='card'>
            <h1>Register</h1>
            {pwMatch && <h4 className='error'>{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
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
                <div className='register-form'>
                    <label>
                        Date of Birth:
                        <br />
                        <input className='register-form-control' 
                        required name='dateOfBirth' 
                        type='text' 
                        placeholder='MM/YY/YYY'/>
                    </label>
                </div>
                <div className='register-form'>
                    <label>
                        Phone Number:
                        <br />
                        <input className='register-form-control' 
                        required name='phoneNumber' 
                        type='text' 
                        placeholder='Phone Humber' />
                    </label>
                </div>
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
                <div className='register-form'>
                    <label>
                        Username:
                        <br />
                        <input className='register-form-control' 
                        required name='username' 
                        type='text' 
                        placeholder='atilla2024'/>
                    </label>
                </div>
                <div className='register-form'>
                    <label>
                        Password:
                        <br />
                        <input className='register-form-control' 
                        id='passwordOne'
                        required name='passwordOne' 
                        type='password' 
                        placeholder='Password'
                        autoComplete='off'/>
                    </label>
                </div>
                <div className='register-form'>
                    <label>
                        Confirm Password:
                        <br />
                        <input className='register-form-control' 
                        required name='passwordTwo' 
                        type='password' 
                        placeholder='Confirm Password'
                        autoCapitalize='off'/>
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