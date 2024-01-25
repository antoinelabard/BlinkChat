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
  let rooms = repository.getChannels();
  // console.log(readDb())
  // console.log(rooms);

  socket.emit("connected");
  socket.emit("rooms", rooms);

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
      const roomsUpdate = repository.getChannels();
      console.log(roomsUpdate[roomsUpdate.length - 1]);

      socket.emit("rooms", roomsUpdate);
      console.log("socket de mise a jour des channels envoyé");
    }, 1000);

    // gerer lidentité avec des cookies ?
  });
  socket.on("delete room", (roomName) => {
    console.log("deleting room " + roomName);
  });
  socket.on("change room", (roomName) => {
    let messages = [];
    for (let i = 0; i < rooms.length; i++) {
      // console.log(rooms[i].getName() === roomName);
      if (rooms[i].getName() === roomName) {
        // console.log(room);
        socket.emit("display message", rooms[i]);
      }
    }
  });

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
