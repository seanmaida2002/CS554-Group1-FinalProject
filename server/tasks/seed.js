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
    "Event Four", 
    "Soccer", 
    "new york", 
    20, 
    "ytIlyWlQUtSPbjrp9sEbON6DT5K2", 
    ['5ASide', 'Football', "Soccer"], 
    'This is a default description for the first event ever',
    '12/20/2024',
    '12:00PM'
)

console.log("Done seeding database");

await closeConnection();
