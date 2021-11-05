import React, { useState } from 'react';

import './Messages.css';
import Message from '../../atoms/Message/Message';

export default function Messages({ messages, players, socket }) {

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (message.length) {
      socket.postMessage(message);
      setMessage('');
    }
  }

  const [message, setMessage] = useState('');

  const sortedMessages = [...messages].sort((a, b) => {
    const aDate = new Date(a.timestamp).getTime();
    const bDate = new Date(b.timestamp).getTime();
    return aDate - bDate;
  });

  const playersObj = {};
  players.forEach(player => {
    playersObj[player.id] = player;
  })

  return (
    <div className="messages">
      <div className="messages__header"></div>
      <div className="messages__list">
        {
          sortedMessages.map((message, idx) => {
            const messageFrom = playersObj[message.from].name;
            return (
              <Message
                message={message}
                from={messageFrom}
                key={`message-${idx}`}
              />
            )
          })
        }
        <form className="messages__compose" id="message-form" action="">
          <input
            className="messages__input"
            name="message-input"
            onChange={handleMessageChange}
            value={message}
          />
          <button
            className="messages__send"
            onClick={handleMessageSend}
            type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}