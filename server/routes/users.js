import { Router } from "express";
const router = Router();
import xss from "xss";


import {
    getUser,
    updateUser,
    deleteUser,
    createUser,
    getUserByUsername,
    createUserSocial,
    getAllUsers
} from '../data/users.js';
import { checkDateOfBirth, checkPhoneNumber, checkString, checkValidEmail, checkValidName, checkValidUsername } from "../helpers.js";

router.route("/:id").get(async (req, res) => {
    //get user with provided id
    try {
        const firebaseUid = req.params.id;
        const user = await getUser(firebaseUid);
        if(user){
            return res.status(200).json(user);
        }
        else{
            return res.status(500).json({error: "Internal Server Error"});
        }
    } catch (e) {
        res.status(404).json({error: "User not found"});
    }
});

router.route("/").post(async (req, res) => {
    //register user
    const addUserFormData = req.body;
    let firstName = xss(addUserFormData.firstName);
    firstName = firstName.trim();
    let lastName = xss(addUserFormData.lastName);
    lastName = lastName.trim();
    let email = xss(addUserFormData.email);
    email = email.trim();
    let username = xss(addUserFormData.username);
    username = username.trim();
    let phoneNumber = xss(addUserFormData.phoneNumber);
    phoneNumber = phoneNumber.trim();
    let dateOfBirth = xss(addUserFormData.dateOfBirth);
    dateOfBirth = dateOfBirth.trim();
    let firebaseUid = addUserFormData.firebaseUid;

    try{
        checkString(firstName, 'First Name');
        checkValidName(firstName, 'First Name');
        checkString(lastName, 'Last Name');
        checkValidName(lastName, 'Last Name');
        checkValidEmail(email, 'Email');
        checkString(username, 'username');
        checkValidUsername(username);
        checkDateOfBirth(dateOfBirth, 'Date of Birth');
        checkPhoneNumber(phoneNumber, 'phone number');

        let newUser = await createUser(
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            dateOfBirth,
            firebaseUid
        );
        return res.status(200).json(newUser);
    } catch(e){
        console.log(e);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.route("/socialSignOn").post(async (req, res) => {
    //register user who signs up with Google
    const addUserFormData = req.body;
    let firstName = xss(addUserFormData.firstName);
    firstName = firstName.trim();
    let lastName = xss(addUserFormData.lastName);
    lastName = lastName.trim();
    let email = xss(addUserFormData.email);
    email = email.trim();
    let username = xss(addUserFormData.username);
    username = username.trim();
    let phoneNumber = xss(addUserFormData.phoneNumber);
    phoneNumber = phoneNumber.trim();
    let dateOfBirth = xss(addUserFormData.dateOfBirth);
    dateOfBirth = dateOfBirth.trim();
    let firebaseUid = addUserFormData.firebaseUid;

    try{
        let newUser = await createUserSocial(
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            dateOfBirth,
            firebaseUid
        );
        return res.status(200).json(newUser);
    } catch(e){
        return res.status(500).json({error: "Internal Server Error"});
    } 
});



router.route("/:id").patch(async (req, res) => {
    //edit user
    const userId = req.params.id;
    const updateData = req.body;
    let firstName = xss(updateData.firstName);
    firstName = firstName.trim();
    let lastName = xss(updateData.lastName);
    lastName = lastName.trim();
    let username = xss(updateData.username);
    username = username.trim().toLowerCase();
    let email = xss(updateData.email);
    email = email.trim().toLowerCase();
    let dateOfBirth = xss(updateData.dateOfBirth);
    dateOfBirth = dateOfBirth.trim();
    let phoneNumber = xss(updateData.phoneNumber);
    phoneNumber = phoneNumber.trim();
    
    try {
        let updateObj = {};
        if(firstName) updateObj.firstName = firstName;
        if(lastName) updateObj.lastName = lastName;
        if(username) updateObj.username = username;
        if(email) updateObj.email = email;
        if(dateOfBirth) updateObj.dateOfBirth = dateOfBirth;
        if(phoneNumber) updateObj.phoneNumber = phoneNumber;

        const updatedUser = await updateUser(userId, updateObj);

        if(updatedUser){
            return res.status(200).json(updatedUser);
        }
        else{
            return res.status(500).json({error: "Internal Server Error"});
        }
    } catch (e) {
        res.status(404).json({error: "User not found"});
    }
});

router.route('/check-username').post(async (req, res) => {
    //check to see if a username is taken
    const username = req.body.username.trim().toLowerCase();
    try{
        const userCollection = await getAllUsers();
        const existingUser = await userCollection.findOne({username: username});
        if(existingUser !== null){
            return res.status(400).json({error: "Username alredy taken"});
        }
        return res.status(200).json({message: "Username available"});
    } catch(e){
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.route('/check-email').post(async (req, res) => {
    //checks to see if an email is taken
    const email = req.body.email.trim().toLowerCase();
    try{
        const userCollection = await getAllUsers();
        const existingUser = await userCollection.findOne({email: email});
        if(existingUser !== null){
            return res.json({error: "Email already in use"});
        }
        return res.json({message: 'Email available'});
    } catch(e){
        return res.status(500).json({error: "Internal Server Error"});
    }
});

export default router;