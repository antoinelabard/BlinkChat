import React, { useEffect, useRef, useState } from 'react';
import bowser from "../assets/BowserHead.webp";
import mario from "../assets/MarioHead.webp";
import pikachu from "../assets/PikachuHead.webp";
import bowserjr from "../assets/BowserJrHead.webp";
import captainFalcon from "../assets/CaptainFalconHead.webp";
import chrome from "../assets/ChromHead.webp";
import cloud from "../assets/CloudHead.webp";
import darkSamus from "../assets/DarkSamusHead.webp";
import drMario from "../assets/DrMarioHead.webp";
import duckHunt from "../assets/DuckHuntHead.webp";
import isabelle from "../assets/IsabelleHead.webp";
import luigi from "../assets/LuigiHead.webp";
import peach from "../assets/PeachHead.webp";
import piranhaPlant from "../assets/PiranhaPlantHead.webp";
import zelda from "../assets/ZeldaHead.webp";

export default function ConversationList({ messages, activeRoom }) {
  const conversationListRef = useRef(null);
  const [userList, setUserList] = useState([bowser, mario, pikachu, bowserjr, captainFalcon,
    chrome, cloud, darkSamus, drMario, duckHunt, isabelle, luigi, peach, piranhaPlant, zelda]);

  function randomIcon() {
    return Math.floor(Math.random() * (userList.length - 0));
  }

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (conversationListRef.current) {
      conversationListRef.current.scrollTop = conversationListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="conversationList" ref={conversationListRef}>
      <ul>
        {messages.length ? (
          messages.map(
            (message, index) => (
              <li key={index}>
                <figure><img src={userList[randomIcon()]} /></figure>
                <div id="info">
                  <span>{message.author}<br/></span>
                  <span>{message.date.slice(11, 16)}</span>
                </div>
                <div id="message">
                  <p>{message.text}</p>
                </div>
              </li>
            )
          )
        ) : (
          <div><p>Send first message</p></div>
        )}
      </ul>
    </div>
  );
}
