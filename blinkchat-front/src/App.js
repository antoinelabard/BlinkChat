import "./App.css";
import { socket } from "./socket";
import React, { useState, useEffect } from "react";
import { PiPlugsBold } from "react-icons/pi";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { IoIosSend } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  Input,
  InputRightElement,
  InputGroup,
  Button,
  Box,
  Text,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  StackDivider,
} from "@chakra-ui/react";

function ChannelList({ rooms, changeRoom, deleteRoom }) {
  return rooms ? (
    <Stack style={{ display: "flex", flexWrap: "wrap" }}>
      {rooms.map((room) => (
        <Box key={room}>
          <Button
            size={"xs"}
            colorScheme={"red"}
            onClick={() => deleteRoom(room)}
          >
            x
          </Button>
          <Button
            size={"xs"}
            colorScheme={"teal"}
            key={room}
            onClick={() => changeRoom(room)}
          >
            {room}
          </Button>
        </Box>
      ))}
    </Stack>
  ) : (
    <p>There are no rooms yet</p>
  );
}
function NewChannelForm({ createRoom }) {
  return (
    <form
      id="create-channel-input"
      onSubmit={(e) => {
        e.preventDefault();
        createRoom(e.target[0].value);
      }}
    >
      <InputGroup>
        <Input type="text" placeholder="Create a channel" />
        <InputRightElement width="4.5rem">
          <button type="submit">
            <IoMdAddCircleOutline />
          </button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

function Conversation({
  messages,
  deleteMessage,
  publishMessage,
  room,
  children,
}) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{room}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4" flexWrap={"wrap"}>
          {messages.map((message, key) => (
            <Box key={key} display={"flex"} justifyContent={"space-between"}>
              <div>
                <Heading size="xs" textTransform="uppercase">
                  {message.author}
                </Heading>
                <Text fontSize={"xs"}>{message.date}</Text>
              </div>
              <Text pt="2" fontSize="sm">
                {message.name}
              </Text>
              <Button
                size={"xs"}
                colorScheme={"red"}
                onClick={() => deleteMessage(message)}
              >
                X
              </Button>
            </Box>
          ))}
          <Box>{children}</Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              publishMessage(e.target[0].value);
            }}
          >
            <InputGroup>
              <Input type="text" placeholder="Send a message" />
              <InputRightElement width="4.5rem">
                <button type="submit">
                  <IoIosSend />
                </button>
              </InputRightElement>
            </InputGroup>
          </form>
        </Stack>
      </CardBody>
    </Card>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([
    {
      name: "Hey salut mec tu veux qu'on se touche?",
      author: "Personne 1",
      date: "now",
    },
    {
      name: "Carrément, t'es vers où toi?",
      author: "Personne 2",
      date: "yesterday",
    },
    {
      name: "Le Gers et toi?",
      author: "Personne 1",
      date: "yesterday",
    },
  ]);
  const [activeRoom, setActiveRoom] = useState(rooms[0] || null);
  const [channelListVisibility, setChannelListVisibility] = useState(false);

  function createRoom(room) {
    socket.emit("create room", room);
  }

  function changeRoom(room) {
    socket.emit("change room", room);
    socket.on("display message", (value) => {
      setMessages(() => value.messages);
    });
  }

  function deleteRoom(room) {
    socket.emit("delete room", room);
  }

  function publishMessage(message) {
    const commands = [
      "/nick",
      "/list",
      "/create",
      "/delete",
      "/join",
      "/quit",
      "/users",
      "/msg",
    ];
    if (message[0] === "/")
      commands.includes(message)
        ? console.log("good boy")
        : console.log("unknown command");
    if (message === "/list") setChannelListVisibility((v) => !v);
    else socket.emit("publish message", message);
  }

  function deleteMessage(message) {
    socket.emit("delete message", message);
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetRooms(rooms) {
      setRooms(() => rooms);
      setActiveRoom(() => rooms[0]);
    }

    socket.on("connected", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms", onGetRooms);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rooms", onGetRooms);
    };
  }, [rooms]);

  return (
    <div className="App">
      {isConnected ? (
        <PiPlugsConnectedBold size={"3em"} />
      ) : (
        <PiPlugsBold size={"3em"} />
      )}

      <NewChannelForm createRoom={createRoom} />

      <Conversation
        room={activeRoom}
        messages={messages}
        deleteMessage={deleteMessage}
        publishMessage={publishMessage}
      >
        {channelListVisibility && (
          <ChannelList
            rooms={rooms}
            changeRoom={changeRoom}
            deleteRoom={deleteRoom}
          />
        )}
      </Conversation>
    </div>
  );
}

export default App;
