// import { useState } from "react";
// import { socket } from "../socket";

export default function Message({ publishMessage, setErrorCommand }) {
  // const [message, setMessage] = useState("");

  // const handleChange = (e) => {
  //   const { value } = e.target;
  //   setMessage(value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorCommand(false);
    const newMessage = e.target[0].value;
    document.getElementById("input").value = "";
    publishMessage(newMessage);
    console.log("ca devrai reset");
    // e.reset();
    // console.log(message);
    // setMessage(""); // Reset the state value to empty
  };

  return (
    <form id="messageForm" onSubmit={handleSubmit}>
      <input
        id="input"
        placeholder="/commands to see all commands"
        type="text"
        name="msg"
        // value={message}
        // onChange={handleChange}
      />
      <button type="submit">
        Envoyer
      </button>
    </form>
    // {}
  );
}
