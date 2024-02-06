import { useState } from "react";

export default function Aside({ joinedRooms, getMessagesByRoom }) {
  const [activeRoom, setActiveRoom] = useState(null);

  const handleRoomClick = (room) => {
    getMessagesByRoom(room.name);
    setActiveRoom(room.name);
  };

  return (
    <aside id="aside">
      <h2>Rooms</h2>
      <ul>
        {joinedRooms.length ? (
          joinedRooms.map((room) => (
            <li 
              key={room.name} 
              onClick={() => handleRoomClick(room)}
              className={activeRoom === room.name ? 'active' : ''}
            >
                {room.name}
            </li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </aside>
  );
}
