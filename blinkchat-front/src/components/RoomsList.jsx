export default function RoomsList({ rooms, graphicalJoinRoom, graphicalDeleteRoom}) {
  // soit une liste de :[username,salon]
  // soit une list d'objet message

  return (
    <div id="roomList">
      <div>Liste des salons</div>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => <li key={elem.name} ><div onClick={() => graphicalJoinRoom(elem.name)} >{elem.name}</div><div onClick={() => graphicalDeleteRoom(elem.name)}>X</div></li>)
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </div>
  );
}
