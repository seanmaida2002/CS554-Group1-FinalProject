import '../App.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doChangePassword } from '../firebase/FirebaseFunctions';

function ChangePassword() {
    const {currentUser} = useContext(AuthContext);
    const [pwMatch, setPWMatch] = useState('');

    const submitForm = async (e) => {
        e.preventDefault();
        const {currentPassword, newPasswordOne, newPasswordTwo} = e.target.elements;


        if(newPasswordOne.value !== newPasswordTwo.value){
            setPWMatch('New Passwords do not match, please try again!');
            return false;
        }

        try{
            await doChangePassword(currentUser.email, currentPassword.value, newPasswordOne.value);
        } catch(e){
            alert(e);
        }
    };
    
    if(currentUser.providerData[0].providerId === 'password'){
        return (
            <div>
                <h2>Hi {currentUser.displayName}, Change Your Password Below</h2>
                <form onSubmit={submitForm}>
                    <div className='changePassword-form-group'>
                        <label>
                            Current Password:
                            <br />
                            <input
                            className='changePassword-form-control'
                            name='currentPassword'
                            id='curentPassword'
                            type='password'
                            placeholder='Current Password'
                            autoComplete='off'
                            required />
                        </label>
                    </div>
                    <br />
                    <div className='changePassword-form-group'>
                        <label>
                            New Password:
                            <br />
                            <input
                            className='changePassword-form-control'
                            name='newPasswordOne'
                            id='newPasswordOne'
                            type='password'
                            placeholder='New Password'
                            autoComplete='off'
                            required />
                        </label>
                    </div>
                    <br />
                    <div className='changePassword-form-group'>
                        <label>
                            Confirm New Password:
                            <br />
                            <input
                            className='changePassword-form-control'
                            name='newPasswordTwo'
                            id='newPasswordTwo'
                            type='password'
                            placeholder='Confirm Password'
                            autoComplete='off'
                            required />
                        </label>
                    </div>
                    {pwMatch && <h4 className='error'>{pwMatch}</h4>}
                    <button className='changePassword-button' type='submit'>Change Password</button>
                </form>
            </div>
        );
    } 
    else{
        return (
            <div>
                <h2>
                    {currentUser.displayName}, You are signed in using Google, You cannot change your password.
                </h2>
            </div>
        );
    }
}

export default ChangePassword;