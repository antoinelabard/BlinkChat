import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Repository from "./data/Repository.js";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to Mongoose successful"))
  .catch(() => console.log("Connection to Mongoose failed"));

io.listen(3000);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

let repository = new Repository();

// console.log(repository.getChannels());

// truc.addChannel("its victor", "victor");
// console.log(truc.getChannels());
// console.log(rooms);
io.on("connection", (socket) => {
  // console.log("a user connected");
  // async function getdb() {
  //   let truc = await repository.getChannels();
  // }
  // console.log(readDb())
  // console.log(rooms);

  socket.emit("connected");
  // console.log(roomss);
  // setTimeout(() => {
  //   // console.log(rooms);
  //   let roomss = ;
  //   setTimeout(() => {

  // console.log(truc);
  let truc = repository.getChannels().then((truc) => {
    let channelList = [];
    for (let i = 0; i < truc.length; i++) {
      channelList.push(truc[i].name);
    }
    socket.emit("rooms", channelList);
  });

  //   }, 6000);
  //   socket.emit("rooms", roomss);
  // }, 6000);

  // console.log(mongoData)
  socket.on("create room", (roomName) => {
    // console.log("Je suis" + socket.id);
    // console.log("demande de creation de " + roomName);

    repository.addChannel(roomName, socket.id);

    // .then(() => {
    //   const roomsUpdate = repository.getChannels();
    //   console.log(roomsUpdate[roomsUpdate.length - 1]);

    // socket.emit("rooms", roomsUpdate);
    // console.log("socket de mise a jour des channels envoyé");
    // });
    // console.log(repository.getChannels());
    setTimeout(() => {
      let channels = repository.getChannels().then((channels) => {
        let channelList = [];
        for (let i = 0; i < channels.length; i++) {
          channelList.push(channels[i].name);
        }
        socket.emit("rooms", channelList);
      });
    }, 1000);

    // gerer lidentité avec des cookies ?
  });
  socket.on("delete room", (roomName) => {
    console.log("deleting room " + roomName);
  });
  // socket.on("change room", (roomName) => {
  //   let messages = [];
  //   for (let i = 0; i < roomss.length; i++) {
  //     // console.log(rooms[i].getName() === roomName);
  //     if (rooms[i].getName() === roomName) {
  //       // console.log(room);
  //       socket.emit("display message", rooms[i]);
  //     }
  //   }
  // });

  socket.on("publish message", (message) => {
    console.log("publishing message: " + message);
  });
  socket.on("delete message", (message) => {
    console.log("deleting message: " + message);
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});
