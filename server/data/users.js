import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

import {
    checkString,
    checkValidEmail,
    checkValidAge,
    checkValidName,
    checkValidUsername,
    checkPhoneNumber, checkDateOfBirth
} from "../helpers.js";

export const createUser = async (
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    dateOfBirth,
    imageUrl,
    imagePath,
    firebaseUid
) => {
    checkString(firstName, 'firstName');
    checkString(lastName, 'lastName');
    checkString(username, 'username');
    checkValidEmail(email, 'email');
    checkPhoneNumber(phoneNumber, 'phoneNumber');
    checkDateOfBirth(dateOfBirth, 'dateOfBirth');

    firstName = firstName.trim();
    checkValidName(firstName, 'firstName');
    lastName = lastName.trim();
    checkValidName(lastName, 'lastName');
    username = username.trim().toLowerCase();
    checkValidUsername(username);
    email = email.trim().toLowerCase();
    phoneNumber = phoneNumber.trim();
    dateOfBirth = dateOfBirth.trim();

    let overThirteen = false;
    if (checkValidAge(dateOfBirth, 'dateOfBirth') > 13) {
        overThirteen = true;
    }

    let newUser = {
        firebaseUid: firebaseUid,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth,
        overThirteen: overThirteen,
        imageUrl: imageUrl,
        imagePath: imagePath,
        eventsMade: [],
        eventsAttending: []
    };

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ username: username });
    if (foundUser) throw "Username already taken";

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user";
    const user = await userCollection.findOne({ _id: insertInfo.insertedId });

    return user;

};

export const createUserSocial = async (
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    dateOfBirth,
    firebaseUid
) => {
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    username = username.trim();
    phoneNumber = phoneNumber.trim();
    dateOfBirth = dateOfBirth.trim();

    let overThirteen = true;
    let newUser = {
        firebaseUid: firebaseUid,
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

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add user";
    const user = await userCollection.findOne({ _id: insertInfo.insertedId });
    return user;
}

export const getUser = async (firebaseUid) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ firebaseUid: firebaseUid });

    if (user === null) {
        throw `No user with that id`;
    }
    user._id = user._id.toString();
    return user;
};

export const deleteUser = async (id) => {
    checkString(id, 'id');
    id = id.trim();

    if (!ObjectId.isValid(id)) {
        throw `Invalid Object ID`;
    }

    const userCollection = await users();
    const user = await userCollection.findOneAndDelete({ _id: new ObjectId(id) });

    if (user === null) {
        throw `No user found with that id`;
    }

    return `Successfully deleted user with id ${id}`;
};

export const updateUser = async (firebaseUid, obj) => {
    const userCollection = await users();
    let user = await userCollection.findOne({ firebaseUid: firebaseUid });
    if (user === null) {
        throw `No user found with id: ${id}`;
    }

    if (obj.firstName) {
        checkString(obj.firstName, "firstName");
        checkValidName(obj.firstName.trim());
        user.firstName = obj.firstName.trim();
    }
    if (obj.lastName) {
        checkString(obj.lastName, "lastName");
        checkValidName(obj.lastName.trim());
        user.lastName = obj.lastName.trim();
    }
    if (obj.username) {
        checkString(obj.username, "username");
        checkValidUsername(obj.username.trim());
        user.username = obj.username.trim();
    }

    if (obj.dateOfBirth) {
        checkDateOfBirth(obj.dateOfBirth, 'dateOfBirth');
        user.dateOfBirth = obj.dateOfBirth.trim();
    }
    if (obj.phoneNumber) {
        checkPhoneNumber(obj.phoneNumber, 'phoneNumber');
        user.phoneNumber = obj.phoneNumber.trim();
    }
    if (obj.email) {
        checkValidEmail(obj.email, 'email');
        user.email = obj.email.trim();
    }
    if (obj.imageUrl) {
        user.imageUrl = obj.imageUrl.trim();
    }

    if (obj.imagePath) {
        user.imagePath = obj.imagePath.trim();
    }
    
    await userCollection.findOneAndUpdate(
        { firebaseUid: firebaseUid },
        { $set: user },
        { returnDocument: "after" }
    );

    if (user === null) {
        throw `Error: no user found with that id`;
    }
    user._id = user._id.toString();
    return user;
}

export const getUserByUsername = async (username) => {
    checkString(username, "username");

    username = username.trim();

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });

    if (user) {
        throw "No user with that username";
    }
    return user;
};

export const getAllUsers = async () => {
    const userCollection = await users();
    return userCollection;
}