import express from "express";

const app = express();
app.listen(3000, () => {
    console.log("We've got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });