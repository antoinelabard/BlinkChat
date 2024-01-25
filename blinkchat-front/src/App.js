import "./App.css";
// import Repository from "./data/Repository.js";
import { socket } from "./socket";
import React, { useState, useEffect } from "react";

function ChannelList({ salons, changeRoom, deleteRoom }) {
  return salons.map((salon) => (
    <div>
      <button key={salon} onClick={() => changeRoom(salon)}>
        {salon}
      </button>
      <button onClick={() => deleteRoom(salon)}>x</button>
    </div>
  ));
}

function Message({ message }) {
  return (
    <li>
      <h1>{message.message} </h1>
      <h2>{message.author}</h2>
      <h3>{message.date}</h3>
      <button>Delete message</button>
    </li>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [salons, setSalons] = useState([]);
  const [messages, setMessages] = useState([]);

  function createRoom(room) {
    socket.emit("create room", room);
  }

  function changeRoom(room) {
    socket.emit("change room", room);
    socket.on("display message", (value) => {
      setMessages(() => value.messages);
    });
  }

  function deleteRoom(room) {
    socket.emit("delete room", room);
  }

  function publishMessage(message) {
    socket.emit("publish message", message);
  }

  function deleteMessage(message) {
    socket.emit("delete message", message);
  }

  useEffect(() => {
    function onConnect() {
      // console.log("connecté au back");
      setIsConnected(true);
    }

    function onDisconnect() {
      // console.log("deconnecté");
      setIsConnected(false);
    }

    function onGetRooms(rooms) {
      // console.log("bipboop je vais chercher les salons");
      console.log(rooms);
      console.log("ongetrooms function");
      setSalons(() => rooms);
    }

    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms", onGetRooms);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rooms", onGetRooms);
    };
  }, [salons]);

  return (
    <div className="App">
      {isConnected ? "connecté!" : "Non connecté"}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRoom(e.target[0].value);
        }}
      >
        <input type="text"></input>
        <button type="submit">Create room</button>
      </form>

      <ChannelList
        salons={salons}
        changeRoom={changeRoom}
        deleteRoom={deleteRoom}
      />
      <ul>
        {messages.map((message) => (
          <Message message={message} />
        ))}
      </ul>
    </div>
  );
}

export default App;
