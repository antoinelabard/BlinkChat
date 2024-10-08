export default function CommandsList() {
  return (
    <div id="commandsList">
      <div>Commands list</div>
      <ul>  
        <li>/nick nickname: define the nickname of the user on the server</li>
        <li>
          /list [string]: list the available channels from the server. If string
          is specified, only displays those whose name contains the string.
        </li>
        <li>/create channel: create a channel with the specified name</li>
        <li> /delete channel: delete the channel with the specified name</li>
        <li>/join channel: join the specified channel</li>
        <li> /quit channel: quit the specified channel.</li>
        <li> /users: list the users currently in the channel</li>
        <li>
          /msg nickname message: send a private message to the specified
          nickname.
        </li>
        <li></li>
      </ul>
    </div>
  );
}