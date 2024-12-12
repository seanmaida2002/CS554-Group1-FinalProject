import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SignOutButton from './SignOut';
import "../App.css";
import CreateEventModal from './CreateEvent';

const Navigation = () => {
    const { currentUser } = useContext(AuthContext);
    return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => { //only display these links in the navigation bar when user is signed-in
    const [showAddForm, setShowAddForm] = useState(false);

    const closeAddFormState = () => {
        setShowAddForm(false);
      };
    
    
    return (
        <nav className='navigation'>
            <ul className='navbar-links-container'>
                <li className='navbar-links'>
                    <NavLink to='/home'>Home</NavLink>
                </li>
                <li className='navbar-links'>
                    
                    <NavLink to='/profile'><img className='navigation-profile' alt='profile image' src='./imgs/profile-icon-white.png'/> </NavLink>
                </li>
                <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
          Create Event
        </button>
        {showAddForm && (
          <CreateEventModal 
          isOpen={showAddForm}
          handleClose={closeAddFormState} />
        )}
            </ul>
        </nav>
    );
}

const NavigationNonAuth = () => { //only display these links in the navigation bar when user is not signed-in
    return (
        <nav className='navigation'>
            <ul>
                <li>
                    <NavLink to='/home'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/login'>Log In</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;