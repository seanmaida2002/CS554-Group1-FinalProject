import express from "express";
import configRoutes from "./routes/index.js";
import cors from 'cors';
import redis from 'redis';

const app = express();

const client = redis.createClient();
await client.connect();

app.use(cors({ origin: ['http://localhost:5173', 'http://huddleupcs554.s3-website.us-east-2.amazonaws.com'], methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for Caching

app.use('/events', async (req, res, next) =>{
  if(req.originalUrl === '/events/'|| req.originalUrl === '/events'){
    if(req.method === 'GET'){
      let exists = await client.exists('getAllEvents');

      if(exists){
        let data = await client.get('getAllEvents');
        return res.status(200).json(JSON.parse(data));
      }

    } 
  }

  next();
});

app.use('/events/:eventId', async (req, res, next) =>{
  if(req.method === 'GET'){
    let id = req.params.eventId;
    let exists = await client.exists(`event:{${id}}`);

    if(exists){
      let data = await client.get(`event:{${id}}`);
      return res.status(200).json(JSON.parse(data));
    }

  }

  next();
});



configRoutes(app);

app.listen(3000, () => {
    console.log("We've got a server!");
    console.log("Your routes will be running on http://3.139.82.74:3000");
  });