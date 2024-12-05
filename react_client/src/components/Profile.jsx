import React, { useState } from "react";
import '../App.css';
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePassword";
import Popup from 'reactjs-popup';
import EditProfileModal from "./EditProfileModal";

function Profile() {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProfile, setEditProfile] = useState(null);

    const handleOpenEditModal = (profile) => {
        setShowEditModal(true);
        setEditProfile(profile);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
    };

    return (
        <div className="card">
            <div className="profile-container">
                <div id="profile-personal-image"><img alt="profile-icon" src='./imgs/profile-icon-black.png' /></div>
                <div id="profile-fullName">First Name Last Name</div>
                <div id='profile-username'>@username</div>
                <br />
                <div id="profile-dateOfBirth">Date of Birth: MM/DD/YY</div>
                <div id='profile-phoneNumber'>Phone Number: 5555555555</div>
                <div id='profile-email'>Email: sample@gmail.com</div>
                <br />
                <button className="button" onClick={() => handleOpenEditModal(profile)}>Edit</button>
                <button className="changePassword-button" onClick={() => setButtonPopup(true)}>Change Password</button>
                <Popup open={buttonPopup} closeOnDocumentClick onClose={() => setButtonPopup(false)} modal >
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
                    />
            )}
        </div>
    )
}

export default Profile;