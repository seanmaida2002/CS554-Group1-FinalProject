import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import * as users from "../data/users.js";
import * as events from '../data/events.js';

const db = await dbConnection();

let user1 = await users.createUser("Cade", "Cermak", "cadecermak", 'cadecermak@gmail.com', '6479868464', '06/27/2003', 
    'https://firebasestorage.googleapis.com/v0/b/cs554-group1-finalproject.firebasestorage.app/o/images%2FuserProfileImage%2FX1JsjAeyCdgf7QkYhz6FaAUNNrx1%2FIMG_0456.jpeg?alt=media&token=bb940289-5fa9-496a-8383-df8db7c319ba', 
       'images/userProfileImage/X1JsjAeyCdgf7QkYhz6FaAUNNrx1/IMG_0456.jpeg','X1JsjAeyCdgf7QkYhz6FaAUNNrx1')

let user1Event = await events.createEvent('NYE BBall', 'Basketball',  '1001 Hudson St, Hoboken, NJ 07030', 50,
            'X1JsjAeyCdgf7QkYhz6FaAUNNrx1',  [ 'Ball', 'Big', 'Comp', '5v5' ], 'Huge Competitive Basketball Tournament on New Years Eve. 5v5 Bring your best team. Prize for the winner!', 
            '12/31/2024', '01:00 PM', 'https://firebasestorage.googleapis.com/v0/b/cs554-group1-finalproject.firebasestorage.app/o/images%2Fevents%2Fundefined%2Fl.jpg?alt=media&token=a74d3d35-94e5-447b-b761-f1dc338124ef'
 );

 let user2 = await users.createUser('Bernard', 'Vitale', 'bvitale', "bvitale01@gmail.com", '7326753523', '11/15/2001',
    'https://firebasestorage.googleapis.com/v0/b/cs554-group1-finalproject.firebasestorage.app/o/images%2FuserProfileImage%2Fi0FCZz2o1sZjjDwpobJyllW9mkr1%2Fyankee%20logo.png?alt=media&token=4c34cef3-5e7c-44ac-9094-4b3e6cd6b977', 
'images/userProfileImage/fl4rIbWzTVOGS0n9ZWTpWlR8fp23/Senior-Picture.JPG', 'fl4rIbWzTVOGS0n9ZWTpWlR8fp23'
 );

 await events.signUpUser(user1Event._id.toString(), 'fl4rIbWzTVOGS0n9ZWTpWlR8fp23', 'X1JsjAeyCdgf7QkYhz6FaAUNNrx1');

 await events.addComment(user1Event._id.toString(), 'fl4rIbWzTVOGS0n9ZWTpWlR8fp23', 'bvitale', 'Should we bring anything? I can go grab a few cases of water if you need!')
 let user3 = await users.createUser('Sean', 'Maida', 'smaida', "smaida2002@yahoo.com", '9738030102', '10/22/2002',
    'https://firebasestorage.googleapis.com/v0/b/cs554-group1-finalproject.firebasestorage.app/o/images%2FuserProfileImage%2Fi0FCZz2o1sZjjDwpobJyllW9mkr1%2Fyankee%20logo.png?alt=media&token=4c34cef3-5e7c-44ac-9094-4b3e6cd6b977', 
'images/userProfileImage/i0FCZz2o1sZjjDwpobJyllW9mkr1/yankee logo.png', 'i0FCZz2o1sZjjDwpobJyllW9mkr1'
 );

 let user2Event = await events.createEvent('Roller Hockey Showdown!', 'Hockey',  '405 Prospect Ave, Union Beach, NJ 07735', 24,
    'X1JsjAeyCdgf7QkYhz6FaAUNNrx1',  [ 'Pick-Up', 'Tournament', 'Just for fun', 'All Ages' ], 'I will be hosting a roller hockey tournament in Union Beach, NJ. Anyone can join and sign up, we are hoping to get 24 plays, so we can get 4 teams of 5 skaters and a goalie. Should be a fun time, hope you sign up!', 
    '02/15/2025', '06:30 PM', 'https://firebasestorage.googleapis.com/v0/b/cs554-group1-finalproject.firebasestorage.app/o/images%2Fevents%2Fundefined%2FRoller-Hockey-Rink-e1661457084781.jpg?alt=media&token=d910c701-9ea3-445a-bae7-b100ad943661'
);


await events.signUpUser(user2Event._id.toString(), 'i0FCZz2o1sZjjDwpobJyllW9mkr1', 'fl4rIbWzTVOGS0n9ZWTpWlR8fp23');
await events.signUpUser(user2Event._id.toString(), 'X1JsjAeyCdgf7QkYhz6FaAUNNrx1', 'fl4rIbWzTVOGS0n9ZWTpWlR8fp23');
await events.addComment(user2Event._id.toString(), 'i0FCZz2o1sZjjDwpobJyllW9mkr1', 'smaida', "Looks like a lot of fun. I'll be there. I'll make sure to tell my friends.")
await events.addComment(user2Event._id.toString(), 'X1JsjAeyCdgf7QkYhz6FaAUNNrx1', 'cadecermak', "I've never played but I'll try!");

console.log("Done seeding database");

    
await closeConnection();


