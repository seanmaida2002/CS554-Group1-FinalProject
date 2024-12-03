import { doSocialSignIn } from "../firebase/FirebaseFunctions";

const SocialSignIn = () => {
    const socialSignOn = async () => {
        try{
            await doSocialSignIn();
        } catch(e){
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

export default SocialSignIn;