import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";

export function checkString(param, name) {
    if (param === undefined || typeof param !== "string") {
        throw `${name} cannot be undefined and must be a string`;
    }

    if (param.trim() === "") {
        throw `${name} cannot be an empty string`;
    }

    return param.trim();
}

export function checkValidEmail(email, name) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

    if (!emailPattern.test(email)) {
        throw `${name} cannot be an invalid email.`;
    }

    return email;
}

export function checkValidName(param, name) {
    const nameRegex = /[^a-zA-Z-]/;

    if (nameRegex.test(param)) {
        throw `${name} must only contain letters and the '-' character.`;
    }

    return param;
}

export function checkValidUsername(param) {
    const usernameRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (param.length < 3 || param.length > 12) {
        throw 'username has to at least 2 characters but less than 12 characters';
    }

    if (usernameRegex.test(param)) {
        throw 'username cannot any contain special characters'
    }

    return param;
}

export function checkValidAge(dateOfBirth, varName) {
    if(!dateOfBirth){
        throw `Error: ${varName} not provided`;
    }
    if(typeof dateOfBirth !== 'string'){
        throw `Error: ${varName} must be a string`;
    }

    const [month, day, year] = dateOfBirth.split('/');
    const dob = new Date(year + "-" + month + "-" + day);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDifference = currentDate.getMonth() - dob.getMonth();

    if(monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())){
        age--;
    }
    if (age < 13) {
        throw "Error: You must be older than 13 to use this website.";
    } 
    return age;
}

export function checkYear(year){ 
    //year must be passed in as a number, Number(year), not as a string

    if(!year){
        throw `Error: Year not provided`;
    }
    if(typeof year !== 'number'){
        throw `Error: Year must be a number`;
    }
    const currentYear = new Date().getFullYear();
    if(year > currentYear || year < 1400 || year <=0){
        throw `Error: Invalid Year`;
    }
}

export function checkDate (date, varName){
    if(!date){
        throw `Error: ${varName} not supplied`;
    }
    if(typeof date !== 'string'){
        throw `Error: ${varName} must be a string`;
    }
    date = date.trim();
    
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if(!regex.test(date)){
        throw `Error: ${varName} must be in the correct MM/DD/YYYY format`;
    }

    const [month, day, year] = date.split('/');
    if(month === "02"){
        if(day === "30"){
            throw `Error: Invalid Date`;
        }
        if(!((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))){
            if(day === "29"){
                throw `Error: Invalid Date`;
            }
        }
    }
    if(month === '04' || month === '06' || month === '09' || month === '11'){
        if (day === '31'){
            throw`Error: Invalid Date`;
        }
    }
    checkYear(Number(year));

}

export function checkID(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
}

export function checkPhoneNumber(number, varName){
    if(!number){
        throw `Error: ${varName} not provided`;
    }
    if(typeof number !== 'string'){
        throw `Error: ${varName} must be a string`;
    }
    number = number.trim();
    if(number.length === 0){
        throw `Error: ${varName} cannot be empty`;
    }
    if(isNaN(Number(number))){
        throw `Error: ${varName} can only contain numbers`;
    }
    if(number.length !== 10){
        throw `Error: ${varName} must be 10 digits long`;
    }
}

export function checkDateOfBirth(dob, varName){
    if(!dob){
        throw `Error: ${varName} not provided`;
    }
    checkDate(dob, varName);
    checkValidAge(dob, varName);
}

export function checkValidEventName(eventName, variableName){
    if(eventName === undefined) throw `Error: ${variableName || "provided variable"} is undefined.`;
    if(typeof eventName !== "string") throw `Error: ${variableName || "provided variable"} is not a string.`;
    eventName = eventName.trim();
    if(eventName.length === 0) throw `Error: ${variableName || "provided variable"} is an empty string.`;
    // Anymore restrictions on event names?
    return eventName
}

export function checkValidSport(sport, variableName){
    if(sport === undefined) throw `Error: ${variableName || "provided variable"} is undefined.`;
    if(typeof sport !== "string") throw `Error: ${variableName || "provided variable"} is not a string.`;
    sport = sport.trim();
    if(sport.length === 0) throw `Error: ${variableName || "provided variable"} is an empty string.`;

    // Need a list of valid sports to validate the sport input    
    // const sports = ['basketball', 'roller hockey', 'ice hockey', 'soccer', 'baseball', 'softball', 'pickle ball']
    return sport;
}

export function checkValidEventSize(eventSize, variableName){
    if(eventSize === undefined) throw `Error: ${variableName || "provided variable"} is undefined.`;
    if(typeof eventSize !== 'number') throw `Error: ${variableName || "provided variable"} is not a number.`;
    if(!Number.isInteger(eventSize)) throw `Error: ${variableName || "provided variable"} must be an integer.`;
    if(eventSize <= 0) throw `Error: ${variableName || "provided variable"} must be greater than 0.`;

    return eventSize;
}


export async function checkValidEventOrganizer(user){
    user = checkString(user, 'user id')
    const userCollection = await users();
    const userFound = await userCollection.findOne({ firebaseUid: user });

    if (!userFound) throw `No user with that id`;

    return user;
}

export function checkValidTags(tags, variableName){
    if(tags === undefined) throw `Error: ${variableName || "provided variable"} is undefined.`;
    if(!Array.isArray(tags)) throw `Error: ${variableName || "provided variable"} is not an array.`;

    tags = tags.map((x) => {
        x = checkString(x, `Error: an item of ${variableName || "provided variable"}`);
        return x;
    });

    return tags;
}

export function checkValidLocation(location, variableName){
    if(location === undefined) throw `Error: ${variableName || "provided variable"} is undefined.`;
    if(typeof location !== "string") throw `Error: ${variableName || "provided variable"} is not a string.`;
    location = location.trim();
    if(location.length === 0) throw `Error: ${variableName || "provided variable"} is an empty string.`;

    // How else are we validating location, is it the name of the venue or the address?
    return location;
}