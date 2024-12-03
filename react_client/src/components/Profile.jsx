import React from "react";
import '../App.css';
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePassword";
function Profile() {

    return (
        <div className="card">
            <ChangePassword />
            <SignOutButton />
        </div>
    )
}

export default Profile;