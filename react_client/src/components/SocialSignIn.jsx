import {doSocialSignIn } from "../firebase/FirebaseFunctions";
import { getAuth } from "firebase/auth";
import axios from "axios";

const SocialSignInLogIn = () => {

    const socialSignOn = async () => {
        try {
            await doSocialSignIn();
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const emailCheck = await axios.post('http://localhost:3000/user/check-email', { email: currentUser.email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (emailCheck.data.message === "Email available") {
                await registerNewUser(auth);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const registerNewUser = async (auth) => {
        try {
            const currentUser = auth.currentUser;
            const firebaseUid = currentUser.uid;
            let [firstName, lastName] = currentUser.displayName.split(" ");
            let email = currentUser.email.trim();
            let phoneNumber = "";
            let dateOfBirth = "";
            let username = currentUser.email.trim();

            let user = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                phoneNumber: phoneNumber,
                dateOfBirth: dateOfBirth,
                firebaseUid: firebaseUid
            }
            await axios.post('http://localhost:3000/user/socialSignOn', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <img
                onClick={socialSignOn}
                alt='google signin'
                src='./imgs/btn_google_signin.png' />

        </div>
    );
}

export default SocialSignInLogIn;