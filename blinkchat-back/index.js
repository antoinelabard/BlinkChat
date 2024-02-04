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
let socketsList = [];
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
function sendTo(name) {}
io.on("connection", (socket) => {
  socket.emit("connected");
  socket.on("give me all users", (roomName) => {
    // console.log(roomName);
    let truc = repository.getChannelByName(roomName).then((truc) => {
      // console.log(truc.commandResult);
      if (truc.commandResult === "error") {
        socket.emit("error");
      } else {
        // console.log(truc.users);
        socket.emit("users", truc.users);
      }

      // socket.emit("rooms", truc);
    });
  });
  socket.on("quit room", (roomName, nickname) => {
    let truc = repository
      .removeUserFromChannel(roomName, nickname)
      .then((truc) => {
        console.log(truc);
        if (truc.commandResult === "success") {
          let joinedRooms = repository
            .getUserSubscribedChannels(nickname)
            .then((joinedRooms) => {
              if (joinedRooms.commandResult === "error") {
                socket.emit("error");
              } else {
                console.log(joinedRooms);
                socket.emit("joined rooms", joinedRooms);
              }
            });
        } else {
          socket.emit("error");
        }
      });
  });
  socket.on("join room", (roomName, nickname) => {
    console.log("Je suis " + nickname + " et je veux rejoindre: " + roomName);
    let truc = repository.addUserToChannel(roomName, nickname).then((truc) => {
      console.log(truc);
      if (truc.commandResult === "success") {
        let joinedRooms = repository
          .getUserSubscribedChannels(nickname)
          .then((joinedRooms) => {
            if (joinedRooms.commandResult === "error") {
              socket.emit("error");
            } else {
              console.log(joinedRooms);
              socket.emit("joined rooms", joinedRooms);
            }
          });
      } else {
        socket.emit("error");
      }
    });
  });
  socket.on("get all rooms", () => {
    let truc = repository.getChannels().then((truc) => {
      socket.emit("rooms", truc);
    });
  });
  socket.on("change name", (name) => {
    console.log(socket);
    repository.login(name).then((truc) => {
      console.log(truc.commandResult);
      if (truc.commandResult === "success") {
        socket.emit("nickname ok", name);

        for (let i = 0; i < socketsList.length; i++) {
          if (socketsList[i].socket === socket) {
            socketsList[i].name = name;
            console.log(socketsList);
          }
        }
      } else {
        socket.emit("nickname not allow");
      }

      // socket.emit("rooms", truc);
    });
  });
  socket.on("choose name", (name) => {
    repository.login(name).then((truc) => {
      console.log(truc.commandResult);
      if (truc.commandResult === "success") {
        socket.emit("nickname ok", name);
        socketsList.push({ name: name, socket: socket });
        console.log(socketsList);
        console.log(socketsList.length);
      } else {
        socket.emit("choose another nickname");
      }

      // socket.emit("rooms", truc);
    });
  });

  socket.on("create room", (roomName, author) => {
    // console.log("Je suis " + author);
    // console.log("demande de creation de " + roomName);
    let truc = repository.addChannel(roomName, author).then((truc) => {
      if (truc.commandResult === "success") {
        let truc = repository.getChannels().then((truc) => {
          socket.emit("rooms", truc);
          let joinedRooms = repository
            .getUserSubscribedChannels(author)
            .then((joinedRooms) => {
              if (joinedRooms.commandResult === "error") {
                socket.emit("error");
              } else {
                console.log(joinedRooms);
                socket.emit("joined rooms", joinedRooms);
              }
            });
        });
      } else {
        socket.emit("error");
      }
    });
    // repository.addChannel(roomName, author);

    // setTimeout(() => {
    //   let channels = repository.getChannels().then((channels) => {
    //     socket.emit("rooms", channels);
    //   });
    // }, 1000);

    // gerer lidentité avec des cookies ?
  });
  socket.on("delete room", (roomName) => {
    console.log("deleting room " + roomName);
    let truc = repository.deleteChannel(roomName).then((truc) => {
      if (truc.commandResult === "success") {
        let truc = repository.getChannels().then((truc) => {
          socket.emit("rooms", truc);
          let joinedRooms = repository
            .getUserSubscribedChannels(roomName)
            .then((joinedRooms) => {
              if (joinedRooms.commandResult === "error") {
                socket.emit("error");
              } else {
                console.log(joinedRooms);
                socket.emit("joined rooms", joinedRooms);
              }
            });
        });
      } else {
        socket.emit("error");
      }
    });
  });
  // le front demande dafficher une autre room
  socket.on("change room", (roomName) => {
    let messages = repository.getMessagesByChannel(roomName);
    socket.emit("display message", messages);
  });

  socket.on("publish message", (message) => {
    let truc = repository
      .addMessage("vicous", "coucou", "maaaa")
      .then((truc) => {
        console.log(truc);
      });
    console.log("publishing message: " + message);
  });
  socket.on("delete message", (message) => {
    console.log("deleting message: " + message);
  });

  socket.on("disconnect", () => {
    let username;
    for (let i = 0; i < socketsList.length; i++) {
      if (socket === socketsList[i].socket) {
        username = socketsList[i].name;
        socketsList.splice(i, 1);
        console.log(socketsList);
      }
    }
    let joinedRooms = repository
      .getUserSubscribedChannels(username)
      .then((joinedRooms) => {
        if (joinedRooms.commandResult === "error") {
          socket.emit("error");
        } else {
          console.log(joinedRooms);
          for (let index = 0; index < joinedRooms.length; index++) {
            let truc = repository
              .removeUserFromChannel(joinedRooms[index].name, username)
              .then((truc) => {
                console.log(truc);
              });
          }
        }
      });
    console.log(socketsList);
    console.log("user disconnected");
  });
});
