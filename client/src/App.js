import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [matchingMessages, setMatchingMessages] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showMatches, setShowMatches] = useState(false);

  // Fetch messages from the backend on component load
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/chat/get-messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "user" };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        await fetch("http://localhost:8080/api/chat/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userMessage),
        });

        setTimeout(async () => {
          const botMessage = {
            text: "This is a bot reply to your query!",
            sender: "bot",
          };

          setMessages((prev) => [...prev, botMessage]);

          await fetch("http://localhost:8080/api/chat/send-message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(botMessage),
          });
        }, 1000);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;

    try {
      const response = await fetch("http://localhost:8080/api/chat/get-messages");
      const data = await response.json();

      const matches = data.filter((message) => {
        if (message && message.text) {
          return message.text.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });

      setMatchingMessages(matches);
      setCurrentMatchIndex(0);
      setShowMatches(true);
    } catch (error) {
      console.error("Error fetching matching messages:", error);
    }
  };

  const handleCloseMatches = () => {
    setShowMatches(false);
  };

  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text; 

    const regex = new RegExp(`(${searchTerm})`, 'gi');  
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Chatbot World!</h1>

        <div className="search-chat-wrapper">
          <div className="search-area-container">
            <div className="search-area">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>

          {showMatches && (
            <div className="matches-container">
              <button className="close-btn" onClick={handleCloseMatches}>✖</button>
              <div className="matches-list">
                <h4>Matching Messages ({matchingMessages.length} found)</h4>
                {matchingMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`match-item ${index === currentMatchIndex ? "highlight" : ""}`}
                    onClick={() => setCurrentMatchIndex(index)}
                  >
                    {highlightText(msg.text, query)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="chat-box">
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === "user" ? "user" : "bot"}`}
                >
                  {highlightText(msg.text, query)}
                </div>
              ))}
            </div>

            <div className="input-area">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;



