import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SignOutButton from './SignOut';
import "../App.css";

const Navigation = () => {
    const {currentUser} = useContext(AuthContext);
    return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
    return (
        <nav className='navigation'>
            <NavLink to='/home'>Home</NavLink>
            <NavLink to='/profle'>Profile</NavLink>
        </nav>
    );
}

const NavigationNonAuth = () => {
    return (
        <nav className='navigation'>
            <NavLink to='/home'>Home</NavLink>
            <NavLink to='/register'>Register</NavLink>
            <NavLink to='/login'>Log-In</NavLink>
        </nav>
    );
};

export default Navigation;