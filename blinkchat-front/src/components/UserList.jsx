import React, { useState } from "react";
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

export default function UsersList({ users, activeRoom }) {
  const [userList, setUserList] = useState([bowser, mario, pikachu, bowserjr, captainFalcon,
  chrome, cloud, darkSamus, drMario, duckHunt, isabelle, luigi, peach, piranhaPlant, zelda]);

  function randomIcon() {
    return Math.floor(Math.random() * (userList.length - 0));
  }

  return (
    <div id="userList">
      <div>Users in room : {activeRoom}</div>
      <ul>
        {users.length ? (
          users.map((elem) => <li key={elem}><div>{elem}</div><img src={userList[randomIcon()]}></img></li>)
        ) : (
          <li>No user</li>
        )}
      </ul>
    </div>
  );
}
