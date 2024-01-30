import { useState } from "react"

export default function Aside() {
    const [rooms, setRooms] = useState(["epitech"]);
    

    function addRoom() {
        setRooms((prevRooms) => [...prevRooms, "Coucou"]);
    }

    return (
        <aside style={{ height:"100%", background: "green"}}>
        <h2>Rooms</h2>
        <ul>
            {rooms.map((elem)=> (
                <li>
                    {elem}
                </li>
            ))}
        </ul>
        <button onClick={addRoom}>AAAAA</button>
    </aside>
    )
}