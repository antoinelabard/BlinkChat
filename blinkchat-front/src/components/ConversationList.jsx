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
      <ul>
        {messages.length ? (
          messages.map(
            (message, index) => (
              <li key={index}>
                <div id="info">
                  <span>{message[1]}<br/></span>
                  <span>{message[2]}</span>
                </div>
                <div id="message">
                  <p>{message[0]}</p>
                </div>
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
