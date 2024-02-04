import Conversation from "./Conversation";
import Message from "./Message";

export default function Main({ publishMessage, rooms, setErrorCommand }) {
  return (
    <main style={{ height: "100%" }}>
      <Conversation rooms={rooms} />
      <Message
        publishMessage={publishMessage}
        setErrorCommand={setErrorCommand}
      />
    </main>
  );
}
