import React, { useState, useEffect } from "react";
import minus from "../assets/remove-circle-outline.svg"

export default function Aside({
  joinedRooms,
  getMessagesByRoom,
  newMessageCount,
  graphicalQuitRoom,
}) {
  // console.log("nouveau render de aside ");
  useEffect(() => {
    console.log("newMessageCount updated:", newMessageCount);
    // You can perform additional logic here if needed
  }, [newMessageCount]);
  // console.log(newMessageCount);
  return (
    <aside id="aside">
      <h2>Rooms</h2>
      <ul>
        {joinedRooms.length ? (
          joinedRooms.map((room, index) => (
            <li key={room.name}>
              <div onClick={() => getMessagesByRoom(room.name)}>
              <p>{room.name}</p>
              {newMessageCount[index] === 0 ? <div></div> :  
              <div><p id="a">{newMessageCount[index] > 99 ? "99+" : newMessageCount[index]}</p></div>
              }  
              </div>
              <figure onClick={ () => graphicalQuitRoom(room.name)}><img src = {minus}></img></figure>
            </li>
          ))
        ) : (
          <p>Pas de salon</p>
        )}
      </ul>
    </aside>
  );
}
