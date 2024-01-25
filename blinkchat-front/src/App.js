import "./App.css";
// import Repository from "./data/Repository.js";
import { socket } from "./socket";
import React, { useState, useEffect } from "react";

function ButtonList({ salons, changeRoomFn, deleteRoomFn }) {
  return salons.map((salon) => (
    <div>
      <button key={salon} onClick={() => changeRoomFn(salon)}>
        {salon}
      </button>
      <button onClick={() => deleteRoomFn(salon)}>x</button>
    </div>
  ));
}

function Message({ message }) {
  return (
    <li>
      <h1>{message.message} </h1>
      <h2>{message.author}</h2>
      <h3>{message.date}</h3>
      <button>X</button>
    </li>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [salons, setSalons] = useState([]);
  const [messages, setMessages] = useState([]);

  function changeRoomFn(room) {
    socket.emit("change room", room);
    socket.on("display message", (value) => {
      setMessages(() => value.messages);
    });
  }
  function deleteRoomFn(room) {
    socket.emit("delete room", room);
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
          socket.emit("create room", e.target[0].value);
        }}
      >
        <input type="text"></input>
        <button type="submit">add</button>
      </form>

      <ButtonList
        salons={salons}
        changeRoomFn={changeRoomFn}
        deleteRoomFn={deleteRoomFn}
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
