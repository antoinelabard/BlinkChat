export default function Header({ activeRoom, userName }) {
  return (
    <header id="header">
      <div>
        <h1>BlinkChat</h1>
      </div>
      <div>
        <p>Room: {activeRoom ? activeRoom : "no active room"}</p>
        <p>User: {userName}</p>
      </div>
    </header>
  );
}
