export default function RoomsList({ rooms, graphicalJoinRoom}) {
  // soit une liste de :[username,salon]
  // soit une list d'objet message

  return (
    <div id="roomList">
      <div>Liste des salons</div>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => <li key={elem.name} onClick={() => graphicalJoinRoom(elem.name)} >{elem.name}</li>)
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </div>
  );
}
