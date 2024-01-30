import "./App.css";
import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { IoIosSend } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
// import Channel from "../../blinkchat-back/models/channel";
import Aside from "./components/Aside";
import Header from "./components/Header";
import Main from "./components/Main";
import Message from "./components/Message";
import Conversation from "./components/Conversation";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [rooms, setRooms] = useState([]);

  const [nickname, setNickname] = useState("");
  const [errorNickname, setErrorNickname] = useState(false);

  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [messages, setMessages] = useState([]);

  //a delete

  function createRoom(room) {
    socket.emit("create room", room);
  }

  function changeRoom(room) {
    socket.emit("change room", room);
  }

  function joinRoom(room) {
    socket.emit("join room", room);
  }

  function deleteRoom(room) {
    socket.emit("delete room", room);
  }

  function changeName(nickname) {
    socket.emit("change nickname", nickname);
  }

  function getRooms() {
    setActiveTab(() => "list");
  }

  function getUsers(room) {
    setActiveTab(() => "users");
  }

  function publishMessage(message) {
    const commands = [
      "/nick",
      "/list",
      "/create",
      "/delete",
      "/join",
      "/quit",
      "/users",
      "/msg",
    ];
    if (message[0] === "/")
      switch (message) {
        case "/nick":
          console.log("change name!");
          changeName(message.substring(6));
          break;

        case "/list":
          console.log("list!");
          getRooms();
          break;

        case "/users":
          console.log("users!");
          setActiveTab(() => "users");
          break;

        case "/create":
          console.log("create room!");
          createRoom(message.substring(9));
          break;

        case "/delete":
          console.log("delete room");
          deleteRoom(rooms);
          break;

        case "/join":
          console.log("join room!");
          joinRoom(rooms);
          break;

        case "/quit":
          console.log("quit room!");
          //aucune idée a revoir
          break;
      }
    else socket.emit("publish message", message);
  }

  function deleteMessage(message) {
    socket.emit("delete message", message);
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetRooms(rooms) {
      console.log("socket rooms recu");
      console.log(rooms);
      setRooms(() => rooms);
    }
    function onChangeNameOk(name) {
      console.log("bravo tu a choisis le pseudo " + name);
      setNickname(name);
    }
    function onChangeNameNotOk() {
      setErrorNickname(true);
    }

    function onJoinRoom(channels) {
      setJoinedRooms(() => channels);
    }
    socket.on("nickname ok", onChangeNameOk);
    socket.on("nickname not allow", onChangeNameNotOk);
    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms", onGetRooms);
    socket.on("joined rooms", onJoinRoom);
    // socket.on("joined rooms", (value) => onJoinRoom(value));
    socket.on("display message", (value) => setMessages(() => value));
  }, [rooms]);

  return (
    <>
      {nickname ? (
        <>
          <Header roomName="test" userName={nickname} />
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 5fr",
              height: "80%",
            }}
          >
            <Aside rooms={rooms} />
            <Main />
          </section>
        </>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
              socket.emit("change name", e.target[0].value);
            }}
          >
            <input placeholder="choose a nickname"></input>
            <button type="submit">Valider</button>
          </form>
          {errorNickname ? <p>Nickname not available</p> : null}
        </>
      )}
    </>
  );
}

export default App;
