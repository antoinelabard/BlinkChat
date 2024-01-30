import React, { useState } from "react"

export default function Header({roomName, userName}) {
    return (
        <header style={{height:"20%", background: "yellow", display: "flex", justifyContent: "space-between"}}>
            <div>
                <h1>BlinkChat</h1>
            </div>

            <div>
                <p>Room: {roomName}</p>
                <p>User: {userName}</p>
            </div>
        </header>
    )
}