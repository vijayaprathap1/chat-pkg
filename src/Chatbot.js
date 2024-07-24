import axios from "axios";
import React, { useState, useEffect } from "react";
 import "./Chatbot.css";
import botLogo from "./assets/img/chatbot.png";
import userBot from "./assets/img/user.png";
/* import getCacheId from "./GenerateId.js";
import { v4 as uuidv4 } from "uuid"; */

const Chatbot = ({ hotelDetails, user, sessionId,pageContext }) => {
  const [bot, displayBot] = useState("");
  const [userExists, setUserExists] = useState(false);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const aiBot = () => {
    displayBot("chatbot");
  };
  const closeBot = () => {
    displayBot("");
  };

  useEffect(() => {
    const identifier = user ? user.id : sessionId;
    console.log("identifer" + identifier);

    const fetchChatHistory = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/chat/history/${identifier}`
      );
      setChat(response.data);
      console.log(response.data);
      if (response.data.length > 0) setUserExists(true);
    };
    fetchChatHistory();
  }, [user, sessionId]);

  const sendMessage = async () => {
    const userMessage = { sender: "user", text: message };
    const identifier = user ? user.id : sessionId;
    if(!hotelDetails){
      var botMessage = { sender: "bot", text: "This is loaded from listing page" };

    }else{
      var botMessage = { sender: "bot", text: "Hello, How can I help you?" };

    }

    try {
      // Send the messages to the backend
      /* const response = */ await axios.post("http://localhost:5000/api/chat", {
        messages: [userMessage, botMessage],
        userId: user?.id,
        sessionId,
        hotelDetails
      });
     

      // Update the chat state
      setChat([...chat, userMessage, botMessage]);

      // Clear the message input field
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  const handleUserInteraction = async () => {
    const userMessage = { sender: "user", text: "OK" };
    const botMessage = {
      sender: "bot",
      text: "To start the conversation, you must accept the terms of use.",
    };
    const botMessage1 = { sender: "bot", text: "Hai, How can i help You ?" };
    // Update the bot message
    setMessage(botMessage.text);

    try {
      // Send the messages to the backend
      const response = await axios.post("http://localhost:5000/api/chat", {
        messages: [botMessage, userMessage, botMessage1],
        userId: user?.id,
        sessionId,
      });

      // Update the chat state
      setChat([...chat, botMessage, userMessage, botMessage1]);

      setMessage("");

      // Indicate that the user exists
      setUserExists(true);
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };


  return (
    <>
      <div className="chat-icon">
        <img
          src={botLogo}
          alt="botlogo"
          className="botlogo"
          width={100}
          onClick={aiBot}
        />
      </div>
      {bot && (
        <div className="chat-bot-block">
          <div className="chat-window">
            <div className="chat-top">
              <div className="assistant-profile">
                <i className="fa-solid fa-robot robot-greet" /> I am Tom, Your
                virtual Assistant
              </div>

              <div className="close-icon" onClick={closeBot}>
                <i className="fa fa-window-close" aria-hidden="true" />
              </div>
            </div>
            {!userExists && (
              <>
                <div className="message bot">
                  <img src={userBot} width={30} alt="user" />
                  To start the conversation, you must accept the terms of use.
                </div>
                <button
                  className={`message user-btn ${
                    userExists ? "user-exists" : "new-user"
                  }`}
                  onClick={handleUserInteraction}
                >
                  Ok
                </button>
              </>
            )}
            {chat.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <img src={userBot} width={30} alt="bot" />
                )}
                {msg.text}
              </div>
            ))}
          </div>
          {userExists && (
            <div className="user-input-block show">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="user-input"
                placeholder="Ask me about the hotel..."
              />
              <button className="send-btn" onClick={sendMessage}>
                <i className="fa fa-paper-plane" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
