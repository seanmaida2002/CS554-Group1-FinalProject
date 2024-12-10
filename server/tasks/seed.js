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
    "KK5mpdSkj2W93IJj8W2uRQy2uGR2", 
    ['Ball', 'Basket', "pickup"], 
    'This is a default description for the first event ever'
)

console.log("Done seeding database");

await closeConnection();
