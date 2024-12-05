import React, { useState } from "react";
import '../App.css';
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePassword";
import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';

function Profile() {
    const [buttonPopup, setButtonPopup] = useState(false);
    return (
        <div className="card">
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
    )
}

export default Profile;