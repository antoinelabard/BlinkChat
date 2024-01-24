import './App.css';
import Repository from "./data/Repository.js";
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

function ButtonList({salons, changeRoomFn}){
  return (
    salons.map((salon) => (<button key={salon} onClick={() => changeRoomFn(salon)}>{salon}</button>))
  )
}

function Message({message}){
  return (
    <li>
      <h1>{message.message} </h1>
      <h2>{message.author}</h2>
      <h3>{message.date}</h3>
      <button>X</button>
    </li>)
}

function App() {
  let socket = io("http://localhost:3000");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [salons, setSalons] = useState([]);
  const [messages, setMessages] = useState([]);


  function changeRoomFn (room){
    socket.emit('change room', room)
    socket.on('display message', (value)=>{
      setMessages(() => value.messages)
    })
  }

  useEffect(() => {
    function onConnect() {
      console.log("connecté au back")
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("deconnecté")
      setIsConnected(false);
    }

    function onGetRooms(rooms){
      console.log("bipboop je vais chercher les salons")
      setSalons(() => rooms)
    }

    socket.on('connected', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('rooms', onGetRooms)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      {isConnected ? "connecté!" : "Non connecté"}
      <ButtonList salons={salons} changeRoomFn={changeRoomFn}/>
      <ul>
        {messages.map((message)=> (
          <Message message={message}/>
        ))}
      </ul>
    </div>
  );
}

export default App;
