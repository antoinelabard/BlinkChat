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

function emitMessagesToAllUSers(messagesTab, roomName) {
  repository.getChannelByName(roomName).then((channel) => {
    for (let i = 0; i < socketsList.length; i++) {
      for (let j = 0; j < channel.users.length; j++) {
        if (socketsList[i].name === channel.users[j]) {
          let bool = "update";
          socketsList[i].socket.emit(
            "display messages",
            messagesTab,
            roomName,
            bool
          );
        }
      }
    }
  });
}
function emitPopUpToAllUSersOfTheRoom(roomName, senderNickname, message) {
  repository.getChannelByName(roomName).then((channel) => {
    for (let i = 0; i < socketsList.length; i++) {
      for (let j = 0; j < channel.users.length; j++) {
        if (socketsList[i].name === channel.users[j]) {
          socketsList[i].socket.emit(
            "pop up",
            roomName,
            senderNickname,
            message
          );
        }
      }
    }
  });
}
let repository = new Repository();

io.on("connection", (socket) => {
  socket.emit("connected");

  socket.on("give me all users", (roomName) => {
    let truc = repository.getChannelByName(roomName).then((truc) => {
      if (truc.commandResult === "error") {
        socket.emit("error");
      } else {
        socket.emit("users", truc.users);
      }
    });
  });
  socket.on("private message", (nickname, dest, privMessage) => {
    for (let i = 0; i < socketsList.length; i++) {
      if (socketsList[i].name === dest) {
        socket.emit("private message", dest, "message envoyé a ");
        socketsList[i].socket.emit("private message", privMessage, nickname);
      }
    }
  });
  socket.on("quit room", (roomName, nickname) => {
    let truc = repository
      .removeUserFromChannel(roomName, nickname)
      .then((truc) => {
        if (truc.commandResult === "success") {
          let joinedRooms = repository
            .getUserSubscribedChannels(nickname)
            .then((joinedRooms) => {
              if (joinedRooms.commandResult === "error") {
                socket.emit("error");
              } else {
                socket.emit("joined rooms", joinedRooms, "delete", roomName);
                socket.emit("reset");
                emitPopUpToAllUSersOfTheRoom(
                  roomName,
                  nickname,
                  `${nickname} leave room ${roomName}`
                );
              }
            });
        } else {
          socket.emit("error");
        }
      });
  });
  socket.on("join room", (roomName, nickname) => {
    let truc = repository.addUserToChannel(roomName, nickname).then((truc) => {
      if (truc.commandResult === "success") {
        let joinedRooms = repository
          .getUserSubscribedChannels(nickname)
          .then((joinedRooms) => {
            if (joinedRooms.commandResult === "error") {
              socket.emit("error");
            } else {
              socket.emit("joined rooms", joinedRooms, "add", roomName);
              socket.join(roomName);
              emitPopUpToAllUSersOfTheRoom(
                roomName,
                nickname,
                `${nickname} join room ${roomName}`
              );
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

  socket.on("get rooms by name", (name) => {
    let tab = [];

    let channels = repository.getChannels().then((channels) => {
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].name.includes(name)) {
          tab.push(channels[i]);
        }
      }

      socket.emit("rooms", tab);
    });
  });

  socket.on("change name", (name) => {
    repository.login(name).then((truc) => {
      if (truc.commandResult === "success") {
        socket.emit("nickname ok", name);

        for (let i = 0; i < socketsList.length; i++) {
          if (socketsList[i].socket === socket) {
            socketsList[i].name = name;
          }
        }
      } else {
        socket.emit("nickname not allow");
      }
    });
  });
  socket.on("choose name", (name) => {
    repository.login(name).then((truc) => {
      if (truc.commandResult === "success") {
        socket.emit("nickname ok", name);
        socketsList.push({ name: name, socket: socket });
        let joinedRooms = repository
          .getUserSubscribedChannels(name)
          .then((joinedRooms) => {
            if (joinedRooms.commandResult === "error") {
              socket.emit("error");
            } else {
              socket.emit("joined rooms", joinedRooms, "add", joinedRooms.name);
            }
          });
      } else {
        socket.emit("choose another nickname");
      }
    });
  });

  socket.on("create room", (roomName, author) => {
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
                socket.emit("joined rooms", joinedRooms, "add", roomName);
              }
            });
        });
      } else {
        socket.emit("error");
      }
    });
  });
  socket.on("delete room", (roomName) => {
    let users;
    let machin = repository.getChannelByName(roomName).then((truc) => {
      try {
        users = truc.users;
      } catch (e) {
        console.log("error");
      }
      if (users === null) {
        socket.emit("error");
      } else {
        let truc = repository.deleteChannel(roomName).then((truc) => {
          if (truc.commandResult === "success") {
            let truc = repository.getChannels().then((truc) => {
              socket.emit("rooms", truc);

              for (let i = 0; i < socketsList.length; i++) {
                for (let j = 0; j < users.length; j++) {
                  if (socketsList[i].name === users[j]) {
                    repository
                      .getUserSubscribedChannels(users[j])
                      .then((joinedRooms) => {
                        if (joinedRooms.commandResult === "error") {
                          socket.emit("error");
                        } else {
                          socketsList[i].socket.emit(
                            "joined rooms",
                            joinedRooms,
                            "delete",
                            roomName
                          );
                          repository.getChannels().then((truc) => {
                            socketsList[i].socket.emit("rooms", truc);
                          });
                        }
                      });
                  }
                }
              }
            });
          } else {
            socket.emit("error");
          }
        });
      }
    });
  });

  socket.on("get messages", (roomName) => {
    let truc = repository.getMessagesByChannel(roomName).then((res) => {
      if (res.commandResult === "error") {
        socket.emit("error");
      } else {
        socket.emit("display messages", res, roomName, "get");
      }
    });
  });
  socket.on("publish message", (message, activeRoom, nickname) => {
    let truc = repository
      .addMessage(nickname, message, activeRoom)
      .then((truc) => {
        repository.getMessagesByChannel(activeRoom).then((res) => {
          if (res.commandResult === "error") {
            socket.emit("error");
          } else {
            emitMessagesToAllUSers(res, activeRoom);
          }
        });
      });
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
      }
    }
    let joinedRooms = repository
      .getUserSubscribedChannels(username)
      .then((joinedRooms) => {
        if (joinedRooms.commandResult === "error") {
          socket.emit("error");
        } else {
          for (let index = 0; index < joinedRooms.length; index++) {
            let truc = repository
              .removeUserFromChannel(joinedRooms[index].name, username)
              .then((truc) => {});
          }
        }
      });
    repository.logout(username).then((res) => {});
  });
});
