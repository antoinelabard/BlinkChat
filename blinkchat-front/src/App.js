import "./App.css";
import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import Aside from "./components/Aside";
import Header from "./components/Header";
import Main from "./components/Main";
import ChooseNicknameForm from "./components/ChooseNicknamePage";
import PopUp from "./components/PopUp";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [nickname, setNickname] = useState("");
  // list of all rooms

  // list of all joined rooms
  const [joinedRooms, setJoinedRooms] = useState([]);
  // the current room name display
  const [activeRoom, setActiveRoom] = useState(null);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([""]);

  // seulement pour la 1ere page
  const [errorNickname, setErrorNickname] = useState(false);

  // affiche un messgae derreur sur la page principle
  const [errorCommand, setErrorCommand] = useState(false);
  // definie quel composant occupe l'espace central
  const [activeTab, setActiveTab] = useState(null);

  const [popUpVisible, setPopUpVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");

  //a delete

  function popUpDisplay(roomName, name, message) {
    console.log();
    setPopUpVisible(true);
    setPopUpMessage(message);
    const timer = setTimeout(() => {
      setPopUpVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }
  function getMessagesByRoom(room) {
    socket.emit("get messages", room);
  }

  function chooseName(name) {
    socket.emit("choose name", name);
  }

  // function deleteRoom(room) {
  //   socket.emit("delete room", room);
  // }

  function changeName(nickname) {
    console.log("demande de changement de nickn,ame");
    socket.emit("change name", nickname);
  }

  function getRooms() {
    socket.emit("get all rooms");
  }

  // function getUsers(room) {
  //   setActiveTab(() => "users");
  // }

  function publishMessage(message) {
    let args = message.split(" ");

    if (message[0] === "/") {
      // fait
      if (message.startsWith("/nick") && args.length === 2) {
        changeName(args[1]);
        // fait (a gerer comment on passe de liste de room a l'affichage de message (03/02))
      } else if (message === "/list") {
        getRooms();
      } else if (message.startsWith("/create")) {
        if (args.length === 2) {
          socket.emit("create room", args[1], nickname);
        } else {
          setErrorCommand(true);
        }
      } else if (message === "/commands") {
        setActiveTab("commands");
      } else if (message.startsWith("/delete") && args.length === 2) {
        console.log("socket de delete envoyé");
        socket.emit("delete room", args[1]);
      } else if (message.startsWith("/join") && args.length === 2) {
        socket.emit("join room", args[1], nickname);
      } else if (message.startsWith("/quit") && args.length === 2) {
        setActiveRoom("");
        setActiveTab("");
        socket.emit("quit room", args[1], nickname);
      } else if (message === "/users" && activeRoom) {
        console.log("give me all users");
        socket.emit("give me all users", activeRoom);
      } else {
        setErrorCommand(true);
      }

      // console.log("provide a nickname");
    } else {
      socket.emit("publish message", message, activeRoom, nickname);
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
  // function deleteMessage(message) {
  //   socket.emit("delete message", message);
  // }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(() => false);
    }
    function onUsers(users) {
      setUsers(users);
      setActiveTab("users");
    }

    function onGetRooms(rooms) {
      console.log("socket rooms recu");
      console.log(rooms);
      setRooms(() => rooms);
      setActiveTab("rooms");
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
    function onMessages(messages, roomName) {
      console.log("socket de message recu");
      console.log(messages);
      console.log(roomName);
      console.log(activeRoom);
      console.log(roomName === activeRoom || activeRoom === null);
      if (roomName === activeRoom || activeRoom === null) {
        console.log("nouvelle liste de message en provenance de " + roomName);
        setMessages(messages);

        setActiveTab("messages");
        setActiveRoom(roomName);
      }
    }
    function onJoinedRoom(channels) {
      setJoinedRooms(() => channels);
    }
    function onPopUp(roomName, nickname, message) {
      console.log("pop up recu");
      popUpDisplay(roomName, nickname, message);
    }
    socket.on("nickname ok", onChangeNameOk);
    socket.on("nickname not allow", onChangeNameNotOk);
    socket.on("choose another nickname", onChooseNameNotOk);
    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms", onGetRooms);
    socket.on("error", OnError);
    socket.on("users", onUsers);
    socket.on("pop up", onPopUp);
    socket.on("joined rooms", onJoinedRoom);
    // socket.on("joined rooms", (value) => onJoinRoom(value));
    socket.on("display messages", onMessages);
  }, [rooms]);

  return (
    <>
      {nickname ? (
        <>
          {popUpVisible ? (
            <PopUp popUpDisplay={popUpDisplay} content={popUpMessage} />
          ) : null}
          <Header
            activeRoom={activeRoom}
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
            <Aside
              joinedRooms={joinedRooms}
              setActiveRoom={setActiveRoom}
              setActiveTab={setActiveTab}
              getMessagesByRoom={getMessagesByRoom}
            />
            <Main
              publishMessage={publishMessage}
              rooms={rooms}
              setErrorCommand={setErrorCommand}
              activeTab={activeTab}
              messages={messages}
              users={users}
              activeRoom={activeRoom}
            />
          </section>
        </>
      ) : (
        <ChooseNicknameForm
          isConnected={isConnected}
          errorNickname={errorNickname}
          chooseName={chooseName}
        />
      )}
    </>
  );
}

export default App;
