import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";

export default function ChooseNicknameForm({isConnected,errorNickname,chooseName,}) {
  return (
    <div id="form-container">
      <div id="topForm">
        {isConnected ? <PiPlugsConnectedBold /> : <PiPlugsBold />}
        {<p id="error-message">Nickname not available</p>}
      </div>
      <div id="chooseNickname">
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
