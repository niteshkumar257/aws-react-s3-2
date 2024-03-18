import React, { useEffect, useState } from "react";
import "./ChatContainer.scss";
import useFetchIssueMessage from "../../hooks/useFetchIssueMessages";

const ChatContainer = ({
  parents_id,
  teacher_id,
  sender,
  receiver,
  ticket_id,
  currenUser,
  role,
}) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const { isLoading, isError, data, error } = useFetchIssueMessage(
    ticket_id,
    sender,
    receiver,
    parents_id,
    teacher_id
  );

  useEffect(() => {
    if (!isLoading) {
      setMessages(data.data.allMessages);
    }
  }, [data]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      //   setMessages([...messages, currentMessage]);
      if (role === "SUPER_ADMIN") {
      } else {
      }
      setCurrentMessage("");
    }
  };

  return (
    <div>
      <div className="message-container">
        {messages.map((message, index) => (
          <>
            {currenUser.toString() === message.sender_id.toString() ? (
              <div key={index} className="message-left">
                <span class="message">{message.messsages}</span>
              </div>
            ) : (
              <div key={index} className="message-right">
                <span class="message">{message.messsages}</span>
              </div>
            )}
          </>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={{ textDecoration: "none" }} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
