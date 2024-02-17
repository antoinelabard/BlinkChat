import deleteIcon  from "../assets/close-circle-outline.svg" ;

export default function RoomsList({ rooms, graphicalJoinRoom, graphicalDeleteRoom}) {
  // soit une liste de :[username,salon]
  // soit une list d'objet message

  return (
    <div id="roomList">
      <div>Rooms list</div>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => <li key={elem.name} ><div onClick={() => graphicalJoinRoom(elem.name)} ><p>{elem.name}</p></div> <figure onClick={() => graphicalDeleteRoom(elem.name)}><img src={deleteIcon}></img></figure> </li>)
        ) : (
          <li>No room created</li>
        )}
      </ul>
    </div>
  );
}
