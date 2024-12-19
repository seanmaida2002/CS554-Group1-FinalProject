import React, { useState, useEffect, useContext } from "react";
import '../App.css';
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePassword";
import Popup from 'reactjs-popup';
import EditProfileModal from "./EditProfileModal";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

function Profile() {
    const [changePasswordButtonPopup, setChangePasswordButtonPopup] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProfile, setEditProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const {currentUser} = useContext(AuthContext);

    const handleOpenEditModal = (profile) => {
        setShowEditModal(true);
        setEditProfile(profile);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
    };

    const handleProfileUpdate = (profile) => {
        setUserProfile(profile);
    }

    useEffect(() => {
        if (currentUser) {
            const fetchUserProfile = async () => {
                try {
                    const { data: user } = await axios.get(`http://3.15.141.91:3000/user/${currentUser.uid}`);
                    setUserProfile(user);
                    setLoading(false);
                } catch (e) {
                    console.log('Error fetching user profile');
                }
            };
            fetchUserProfile();
        }
        
    }, [currentUser]);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="profile-container">
                <div id="profile-personal-image"><img alt="profile-icon" src={userProfile.imageUrl ? userProfile.imageUrl : '../imgs/profile-icon-black.png'} /></div>
                <div id="profile-fullName">{`${userProfile.firstName} ${userProfile.lastName}`}</div>
                <div id='profile-username'>@{`${userProfile.username}`}</div>
                <br />
                <div id="profile-dateOfBirth">Date of Birth: {`${userProfile.dateOfBirth}`}</div>
                <div id='profile-phoneNumber'>Phone Number: {`${userProfile.phoneNumber}`}</div>
                <div id='profile-email'>Email: {`${userProfile.email}`}</div>
                <br />
                <button className="button" onClick={() => handleOpenEditModal(userProfile)}>Edit</button>
                <button className="changePassword-button" onClick={() => setChangePasswordButtonPopup(true)}>Change Password</button>
                <Popup open={changePasswordButtonPopup} closeOnDocumentClick onClose={() => setChangePasswordButtonPopup(false)} modal >
                    {(close) => (
                        <div className="popup-overlay">
                            <div className="popup">
                                <ChangePassword />
                                <button className="button" onClick={close}>Close</button>
                            </div>
                        </div>
                    )}
                </Popup>
                <SignOutButton />
            </div>
            {showEditModal && (
                <EditProfileModal
                    isOpen={showEditModal}
                    profile={editProfile}
                    handleClose={handleCloseModals}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </div>
    )
}

export default Profile;