import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import * as users from "../data/users.js";
import * as events from '../data/events.js';

const db = await dbConnection();
// await db.dropDatabase();

// const user1 = await users.createUser(
//     "Sean",
//     "Maida",
//     "smaida",
//     "smaida2002@yahoo.com",
//     "9738030102",
//     "10/22/2002"
// );
// console.log(user1);
const event1 = await events.createEvent(
    "Event One", 
    "basketBall", 
    "new Jersey", 
    45, 
    "6758c241dbe6502984cd0147", 
    ['Ball', 'Basket', "pickup"], 
    'This is a default description for the first event ever'
)

console.log("Done seeding database");

await closeConnection();
