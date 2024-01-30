import { useState } from "react";

export default function Message() {
  const [message, setMessage] = useState({
    msg: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSendMessage(message);
    setMessage("");
  };

  return (
    <form style={{ height: "15%" }} onSubmit={handleSubmit}>
      <input
        style={{
          border: "5px solid black",
          height: "100%",
          width: "80%",
          padding: "1rem",
        }}
        type="text"
        name="msg"
        value={message.msg}
        onChange={handleChange}
      />
      <button style={{ width: "20%" }} type="submit">
        Envoyer
      </button>
    </form>
  );
}
