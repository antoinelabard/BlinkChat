export default function Aside({ joinedRooms, getMessagesByRoom }) {
  return (
    <aside id="aside">
      <h2>Rooms</h2>
      <ul>
        {joinedRooms.length ? (
          joinedRooms.map((room) => (
            <li key={room.name}>
              <button onClick={() => getMessagesByRoom(room.name)}>
                {room.name}
              </button>
            </li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </aside>
  );
}
