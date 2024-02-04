export default function UsersList({ users }) {
  return (
    <div style={{ border: "5px solid blue", overflowY: "auto", height: "85%" }}>
      <div>Liste des Users du salon actif</div>
      <ul>
        {users.length ? (
          users.map((elem) => <li key={elem}>{JSON.stringify(elem)}</li>)
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </div>
  );
}
