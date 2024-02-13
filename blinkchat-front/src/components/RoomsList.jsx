import deleteIcon  from "../assets/close-circle-outline.svg" ;

export default function RoomsList({ rooms, graphicalJoinRoom, graphicalDeleteRoom}) {
  // soit une liste de :[username,salon]
  // soit une list d'objet message

  return (
    <div id="roomList">
      <div>Liste des salons</div>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => <li key={elem.name} ><div onClick={() => graphicalJoinRoom(elem.name)} >{elem.name}</div> <figure onClick={() => graphicalDeleteRoom(elem.name)}><img src={deleteIcon}></img></figure> </li>)
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </div>
  );
}
