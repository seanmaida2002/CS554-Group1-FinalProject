import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import {
    checkString,
    checkArray,
    checkValidEmail,
    checkValidAge,
    checkValidName,
    checkValidUsername,
    checkPhoneNumber, checkDateOfBirth
} from "../helpers.js";

export const createUser = async ( //need to add profile picture
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    dateOfBirth
) => {
    checkString(firstName, 'firstName');
    checkString(lastName, 'lastName');
    checkString(username, 'username');
    checkValidEmail(email, 'email');
    checkPhoneNumber(phoneNumber, 'phoneNumber');
    checkDateOfBirth(dateOfBirth, 'dateOfBirth');

    firstName = firstName.trim();
    lastName = lastName.trim();
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    phoneNumber = phoneNumber.trim();
    dateOfBirth = dateOfBirth.trim();

    let overThirteen = False;
    if (checkValidAge(dob, 'dateOfBirth') > 13) {
        overThirteen = True;
    }

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth,
        overThirteen: overThirteen,
        eventsMade: [],
        eventsAttending: []
    };

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: username });
    if (foundUser) throw "Username already taken";

    const insertInfo = await userCollection.insertOne(newProd);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user";
    const user = await userCollection.findOne({ _id: insertInfo.insertedId });

    return user;

}