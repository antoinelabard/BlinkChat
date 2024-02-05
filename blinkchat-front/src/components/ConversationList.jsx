import React, { useEffect, useRef } from 'react';

export default function ConversationList({ messages, activeRoom }) {
  const conversationListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (conversationListRef.current) {
      conversationListRef.current.scrollTop = conversationListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="conversationList" ref={conversationListRef}>
      <h1>Liste des messages du salon : {activeRoom}</h1>
      <ul>
        {messages.length ? (
          messages.map(
            (message, index) => (
              <li key={index}>
                {message[0]}, {message[1]}, {message[2]}
              </li>
            )
          )
        ) : (
          <p>Pas de message dans ce salon</p>
        )}
      </ul>
    </div>
  );
}
