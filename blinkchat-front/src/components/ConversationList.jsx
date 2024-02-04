export default function ConversationList({ messages, activeRoom }) {
  if (messages === undefined) {
    messages = [];
  }
  return (
    <>
      <h1>Liste des messages du salon : {activeRoom}</h1>
      <ul>
        {messages.length ? (
          messages.map(
            (message) => (
              <li>
                {message[0]},{message[1]},{message[2]}
              </li>
            )
            // console.log(message)
          )
        ) : (
          <p>Pas de message dans ce salon</p>
        )}
      </ul>
    </>
  );
}
