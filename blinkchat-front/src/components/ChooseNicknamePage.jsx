import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";

export default function ChooseNicknameForm({
  isConnected,
  errorNickname,
  chooseName,
}) {
  return (
    <>
      {isConnected ? <PiPlugsConnectedBold /> : <PiPlugsBold />}
      <form
        id="chooseNickname"
        onSubmit={(e) => {
          e.preventDefault();
          //   socket.emit("choose name", e.target[0].value);
          chooseName(e.target[0].value);
        }}
      >
        <input placeholder="choose a nickname"></input>
        <button type="submit">Valider</button>
      </form>
      {errorNickname ? <p>Nickname not available</p> : null}
    </>
  );
}
