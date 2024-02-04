import { useState } from "react";
import { socket } from "../socket";

export default function Aside({ joinedRooms, setActiveRoom }) {
  console.log(joinedRooms);

  function displayRoom(name) {
    setActiveRoom(name);
  }

  return (
    <aside style={{ height: "100%", border: "5px solid green" }}>
      <h2>Rooms</h2>
      <ul>
        {joinedRooms.length ? (
          joinedRooms.map((elem) => (
            <li onClick={() => setActiveRoom(elem.name)} key={elem.name}>
              {JSON.stringify(elem.name)}
            </li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </aside>
  );
}
