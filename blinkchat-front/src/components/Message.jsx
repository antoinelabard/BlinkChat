import { useState } from "react";
import { socket } from "../socket";

export default function Message({ publishMessage, setErrorCommand }) {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorCommand(false);
    const newMessage = e.target[0].value;
    publishMessage(newMessage);
    console.log("ca devrai reset");
    console.log(message);
    setMessage(""); // Reset the state value to empty
  };

  return (
    <form style={{ height: "15%" }} onSubmit={handleSubmit}>
      <input
        placeholder="/commands to see all commands"
        style={{
          border: "5px solid black",
          height: "100%",
          width: "80%",
          padding: "1rem",
        }}
        type="text"
        name="msg"
        value={message}
        onChange={handleChange}
      />
      <button style={{ width: "20%" }} type="submit">
        Envoyer
      </button>
    </form>
    // {}
  );
}
