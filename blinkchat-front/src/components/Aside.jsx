import { useState } from "react";

export default function Aside({ rooms }) {
  return (
    <aside style={{ height: "100%", border: "5px solid green" }}>
      <h2>Rooms</h2>
      <ul>
        {rooms.length ? (
          rooms.map((elem) => (
            <li key={elem.name}>{JSON.stringify(elem.name)}</li>
          ))
        ) : (
          <li>Pas de salon</li>
        )}
      </ul>
    </aside>
  );
}
