import React, { useState } from "react";

export default function Header({ activeRoom, userName, errorCommand }) {
  return (
    <header id="header">
      <div>
        <h1>BlinkChat</h1>
      </div>
      {errorCommand ? <div>erreur de commande</div> : null}
      <div>
        <p>Room: {activeRoom ? activeRoom : "no active room"}</p>
        <p>User: {userName}</p>
      </div>
    </header>
  );
}
