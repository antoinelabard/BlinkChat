import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";

export default function ChooseNicknameForm({isConnected,errorNickname,chooseName,}) {
  return (
    <div id="form-container">
      <div id="topForm">
        <h1>BlinkChat</h1>
      </div>
      <div id="chooseNickname">
        <form onSubmit={(e) => {
            e.preventDefault();
            chooseName(e.target[0].value);
          }}
        >
          <input placeholder="Choose a nickname"></input>
          <button type="submit">Valider</button>
        </form>
      </div>
    </div>
  );
}
