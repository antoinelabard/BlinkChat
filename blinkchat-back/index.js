// Define the Message class
class Message {
    constructor(message, author, date) {
      this.message = message;
      this.author = author;
      this.date = date;
    }
    
  }
  
  // Define the Room class
  class Room {
    constructor(name, author) {
      this.name = name;
      this.author = author;
      this.messages = [];
    }
  
    addMessage(message) {
      this.messages.push(message);
    }
    getName(){
      return this.name;
    }
    getMessages(){
      return this.messages;
    }
  
  }
  
  function writeDb(rooms){
   fs.writeFile('data/jsonDb.json', JSON.stringify(rooms), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File written successfully!');
    }
  });
  }

  import express from 'express';
  import { createServer } from'node:http';
  import { join } from 'node:path';
  import { Server } from'socket.io';
  import cors  from 'cors';
  import mongoose from "mongoose"
  import 'dotenv/config'

//   const app = express();
//   const httpServer = createServer(app);
// const io = new Server(httpServer, { 
    

//     cors: {
//         origin: "http://localhost:3001",
        
//       }
//  });

// io.on("connection", (socket) => {
//   // ...
// });
const app = express()
const server = createServer(app)
const io = new Server(server, { 
    

  cors: {
      origin: "http://localhost:3001",
      
    }})


const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection to Mongoose successful'))
    .catch(() => console.log('Connection to Mongoose failed'))

httpServer.listen(3000);
  
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });
  
  let room = new Room('Cuisine', 'vicous');
  let message1 = new Message('trop bon les haricots', 'vicous', '10/12/2048');
  let message2 = new Message('trop bon les pates', 'vicous', '10/12/2048');
  room.addMessage(message1);
  room.addMessage(message2);
  
  let room2 = new Room('tropique', 'vicous');
  let message3 = new Message('trop bon les citrons', 'vicous', '10/12/2048');
  let message4 = new Message('trop bon les carbonaras', 'vicous', '10/12/2048');
  room2.addMessage(message3);
  room2.addMessage(message4);
  
  let rooms = [];
  // console.log(readDb())
  rooms.push(room);
  rooms.push(room2);
  
  console.log(rooms);
  io.on('connection', (socket) => {
    console.log('a user connected');
    // console.log(readDb())
    let roomsName = []
    for(let i = 0 ; i < rooms.length;i++){
      roomsName.push(rooms[i].getName())
    }
    socket.emit('connected');
    socket.emit('rooms', roomsName);
  
    // console.log(mongoData)
    socket.on('create room', (roomName) => {
      console.log("Je suis"+socket.id)
      console.log("demande de creation de " + roomName )
      // gerer lidentité avec des cookies ?
    })
    socket.on('delete room', (roomName) => {
      console.log("demande de suppresion")
      console.log(roomName)
  
  
    })
    socket.on('change room', (roomName) => {
      // console.log(JSON.stringify(rooms));
      // console.log(mongoData)
      
        let messages = []
        for(let i = 0 ; i < rooms.length;i++){
         
          console.log(rooms[i].getName()=== roomName)
          if(rooms[i].getName()=== roomName){
            console.log(room)
            socket.emit('display message', rooms[i]);
        }
        }
        
      
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
//   server.listen(3000, () => {
//     console.log('server running at http://localhost:3000');
//   });
  