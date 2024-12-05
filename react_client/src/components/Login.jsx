import React, {useContext} from "react";
import SocialSignIn from "./SocialSignIn";
import {Navigate} from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { doSignInWithEmailAndPassword, doPasswordReset } from "../firebase/FirebaseFunctions";
import { Link } from "react-router-dom";

function Login() {
    const {currentUser} = useContext(AuthContext);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        let {email, password} = e.target.elements;

        try{
            await doSignInWithEmailAndPassword(email.value, password.value);
        } catch(e){
            alert(e);
        }
    };

    const passwordReset = (e) => {
        e.preventDefault();
        let email = document.getElementById('email').value;
        if(email) {
            doPasswordReset(email);
            alert("Password reset email was sent");
        } else{
            alert("Please enter an email address below before you click the forgot password link");
        }
    };

    if(currentUser){
        return <Navigate to='/home' replace={true} />
    }

    return (
        <div>
            <div className="card">
                <h1>Log In</h1>
                <p >Don't have an account yet? <Link to='/register' className="sign-up">Sign Up</Link></p>
                <br />
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-form-group">
                        <label>
                            Email Address 
                            <br />
                            <input
                            name='email'
                            id='email'
                            type='email'
                            placeholder="Email"
                            required
                            autoFocus={true} />
                        </label>
                    </div>
                    <br />
                    <div className="login-form-group">
                        <label>
                            Password:
                            <br />
                            <input
                            name='password'
                            type='password'
                            placeholder="Password"
                            required
                            autoComplete="off" />
                        </label>
                    </div>
                    <button className="button" type="submit">Log In</button>
                    <br />
                    <br />
                    <button className="forgotPassword" onClick={passwordReset}>Forgot Password</button>
                </form>
                <br />
                <SocialSignIn />
            </div>
        </div>
    );
}

export default Login;