import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import * as users from "../data/users.js";

const db = await dbConnection();
await db.dropDatabase();

const user1 = await users.createUser(
    "Sean",
    "Maida",
    "smaida",
    "smaida2002@yahoo.com",
    "9738030102",
    "10/22/2002"
);
console.log(user1);

console.log("Done seeding database");

await closeConnection();
