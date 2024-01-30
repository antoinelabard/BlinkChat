import { useState } from "react"

export default function Message() {
    const [message, setMessage] = useState({
        msg : "",
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        setMessage((prevMessage) => ({
            prevMessage, 
            [name] : value,
        })); 
    } ;


    return (
        <input type="text" name = "message" value = {message.msg} onChange={handleChange}/>
    )
}