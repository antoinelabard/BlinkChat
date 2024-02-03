import React, { useState } from "react";

export default function Header({ roomName, userName, errorCommand }) {
  return (
    <header
      style={{
        height: "20%",
        background: "yellow",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h1>BlinkChat</h1>
      </div>
      {errorCommand ? <div>erreur de commande</div> : null}
      <div>
        <p>Room: {roomName ? roomName : "no active room"}</p>
        <p>User: {userName}</p>
      </div>
    </header>
  );
}
