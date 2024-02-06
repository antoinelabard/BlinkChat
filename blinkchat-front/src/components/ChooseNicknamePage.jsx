import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";

export default function ChooseNicknameForm({
  isConnected,
  errorNickname,
  chooseName,
}) {
  return (
    <div id="form-container">
      {errorNickname && <p id="error-message">Nickname not available</p>}
      <div id="chooseNickname">
        <div id="icon-container">
          {isConnected ? <PiPlugsConnectedBold /> : <PiPlugsBold />}
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
            chooseName(e.target[0].value);
          }}
        >
          <input placeholder="choose a nickname"></input>
          <button type="submit">Valider</button>
        </form>
      </div>
    </div>
  );
}
