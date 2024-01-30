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
    // origin: "*",
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: "http://localhost:8080",
//     methods: ["GET", "POST"]
//   }
// });
let nicknames = [
  // {
  //   nickname: "anton",
  //   socket: "socket",
  // },
];
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

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("a user connected");
  repository.getChannels().then((truc) => {
    // console.log(truc);
    socket.emit("rooms", truc);
  });
  socket.emit("connected");
  socket.emit("joined rooms", repository.getChannelByUser(socket.id));
  socket.on("join room", (roomName) => {
    console.log("Je suis " + socket.id + " et je veux rejoindre: " + roomName);

    socket.emit("joined rooms", repository.getChannelByUser(socket.id));
  });

  // });
  socket.on("get all rooms", () => {
    let truc = repository.getChannels().then((truc) => {
      socket.emit("rooms", truc);
    });
  });
  socket.on("change name", (name) => {
    if (!nicknames.includes(name)) {
      nicknames.push(name);
      socket.emit("nickname ok", name);
      console.log(nicknames);
    } else {
      socket.emit("nickname not allow");
    }
  });
  socket.on("create room", (roomName) => {
    console.log("Je suis" + socket.id);
    console.log("demande de creation de " + roomName);

    repository.addChannel(roomName, socket.id);

    setTimeout(() => {
      let channels = repository.getChannels().then((channels) => {
        socket.emit("rooms", channels);
      });
    }, 1000);

    // gerer lidentité avec des cookies ?
  });
  socket.on("delete room", (roomName) => {
    console.log("deleting room " + roomName);
  });
  // le front demande dafficher une autre room
  socket.on("change room", (roomName) => {
    let messages = repository.getMessagesByChannel(roomName);
    socket.emit("display message", messages);
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
