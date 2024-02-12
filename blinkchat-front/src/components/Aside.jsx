import React, { useState, useEffect } from "react";

export default function Aside({
  joinedRooms,
  getMessagesByRoom,
  newMessageCount,
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
              <button onClick={() => getMessagesByRoom(room.name)}>
                {room.name}
              </button>
              <p>{newMessageCount[index]}</p>
            </li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </aside>
  );
}
