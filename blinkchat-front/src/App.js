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
  const [nickname, setNickname] = useState("");
  // list of all rooms
  const [rooms, setRooms] = useState([""]);
  // list of all joined rooms
  const [joinedRooms, setJoinedRooms] = useState([""]);
  // the current room name display
  const [activeRoom, setActiveRoom] = useState(null);

  const [messages, setMessages] = useState([]);

  // seulement pour la 1ere page
  const [errorNickname, setErrorNickname] = useState(false);

  // affiche un messgae derreur sur la page principle
  const [errorCommand, setErrorCommand] = useState(false);

  // const [activeTab, setActiveTab] = useState(null);

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
    console.log("demande de changement de nickn,ame");
    socket.emit("change name", nickname);
  }

  function getRooms() {
    socket.emit("get all rooms");
  }

  function getUsers(room) {
    // setActiveTab(() => "users");
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
    let args = message.split(" ");
    // console.log(args);
    // console.log("args.length:" + args.length);
    // console.log("coucou");
    if (message[0] === "/") {
      // fait
      if (message.startsWith("/nick") && args.length > 1) {
        changeName(args[1]);
        // fait (a gerer comment on passe de liste de room a l'affichage de message (03/02))
      } else if (message.startsWith("/list") && args.length == 1) {
        getRooms();
      } else if (message.startsWith("/create")) {
        if (args.length === 2) {
          socket.emit("create room", args[1], nickname);
        } else {
          setErrorCommand(true);
        }
      } else if (message === "/commands") {
      } else {
        setErrorCommand(true);
      }

      // console.log("provide a nickname");
    } else {
      socket.emit("publish message", message, activeRoom);
    }
  }

  //   case "/list":
  //     // exemple "/list truc"
  //     if (message.split("").length > 1) {
  //     } else {
  //       console.log("list!");
  //       getRooms();
  //     }

  //     break;

  //   case "/users":
  //     console.log("users!");
  //     setActiveTab(() => "users");
  //     break;

  //   case "/create":
  //     console.log("create room!");
  //     createRoom(message.substring(9));
  //     break;

  //   case "/delete":
  //     console.log("delete room");
  //     deleteRoom(rooms);
  //     break;

  //   case "/join":
  //     console.log("join room!");
  //     joinRoom(rooms);
  //     break;

  //   case "/quit":
  //     console.log("quit room!");
  //     //aucune idée a revoir
  //     break;
  // }
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
      setErrorCommand(true);
    }
    function onChooseNameNotOk() {
      setErrorNickname(true);
    }
    function OnError() {
      setErrorCommand(true);
    }

    function onJoinRoom(channels) {
      setJoinedRooms(() => channels);
    }
    socket.on("nickname ok", onChangeNameOk);
    socket.on("nickname not allow", onChangeNameNotOk);
    socket.on("choose another nickname", onChooseNameNotOk);
    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms", onGetRooms);
    socket.on("error", OnError);
    socket.on("joined rooms", onJoinRoom);
    // socket.on("joined rooms", (value) => onJoinRoom(value));
    socket.on("display message", (value) => setMessages(() => value));
  }, [rooms]);

  return (
    <>
      {nickname ? (
        <>
          <Header
            roomName={activeRoom}
            userName={nickname}
            errorCommand={errorCommand}
          />
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 5fr",
              height: "80%",
            }}
          >
            <Aside joinedRooms={joinedRooms} />
            <Main
              publishMessage={publishMessage}
              rooms={rooms}
              setErrorCommand={setErrorCommand}
            />
          </section>
        </>
      ) : (
        <>
          <form
            id="chooseNickname"
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("choose name", e.target[0].value);
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
