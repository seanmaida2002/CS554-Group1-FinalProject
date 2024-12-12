import express from "express";
import configRoutes from "./routes/index.js";
import cors from 'cors';
import redis from 'redis';

const app = express();

const client = redis.createClient();
await client.connect();

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', ,'PATCH', 'DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for Caching

app.use('/events', async (req, res, next) =>{
  if(req.originalUrl === '/events/'|| req.originalUrl === '/events'){
    if(req.method === 'GET'){
      let exists = await client.exists('getAllEvents');

      if(exists){
        let data = await client.json.get('getAllEvents');
        return res.status(200).json(data);
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
      let data = await client.json.get(`event:{${id}}`);
      return res.status(200).json(data);
    }

  }

  next();
});



configRoutes(app);

app.listen(3000, () => {
    console.log("We've got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });