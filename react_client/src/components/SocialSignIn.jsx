import { doSocialSignIn } from "../firebase/FirebaseFunctions";

const SocialSignIn = () => {
    const socialSignOn = async () => {
        try{
            await doSocialSignIn();
        } catch(e){
            alert(e);
        }
    };

    return (
        <div>
            <img
            onClick={socialSignOn}
            alt='google signin'
            src='./public/imgs/btn_google_signin.png' />
        </div>
    );
}

export default SocialSignIn;