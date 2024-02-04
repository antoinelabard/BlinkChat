export default function Conversation({ rooms }) {
  console.log(rooms + "ferefer");

  // soit une liste de :[username,salon]
  // soit une list d'objet message

  return (
    <div style={{ border: "5px solid blue", overflowY: "auto", height: "85%" }}>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => (
            <li key={elem.name}>{JSON.stringify(elem.name)}</li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </div>
  );
}
