import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

// Combined WhatsApp and ChatBot component
const CombinedChat = () => {
  const phoneNumber = "+9779807677391";
  const message = "Hello, I want to Purchase a Subscription!";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp chat handler
  const handleWhatsAppClick = () => {
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  // Fetch chat history from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(fireDB, "chatMessages"));
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    };

    fetchMessages();

    // Reset chat after 100 seconds
    const resetChatTimer = setInterval(() => {
      resetChat();
    }, 60000); // 1 min

    return () => {
      clearInterval(resetChatTimer);
    };
  }, []);

  // Reset chat by clearing messages from Firestore and local state
  const resetChat = async () => {
    const querySnapshot = await getDocs(collection(fireDB, "chatMessages"));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    setMessages([]); // Clear local state
  };

  // Handle form submission (user sends message)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { text: input, sender: "user", timestamp: new Date() };

      try {
        // Add the user message to Firestore
        await addDoc(collection(fireDB, "chatMessages"), userMessage);

        // Generate a bot response
        const botResponse = {
          text: generateBotResponse(input),
          sender: "bot",
          timestamp: new Date(),
        };

        // Add the bot response to Firestore
        await addDoc(collection(fireDB, "chatMessages"), botResponse);

        // Update the state
        setMessages((prev) => [...prev, userMessage, botResponse]);

        // Clear input
        setInput("");
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  // Simple bot response generator
  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes("netflix")) {
      return `Netflix subscription details
Get private 4K quality on 1 screen for a steal! 🖥

- Monthly: Rs. 399
- 3 Months: Rs. 1169
- 6 Months: Rs. 2300
- Yearly: Rs. 4499

Remember to follow the rules:

- Use only the provided profile
- Don't change the account email or password
- Don't add a mobile number
- Limit login to 1 device
`;
    } else if (message.includes("prime")) {
      return `Amazon Prime subscription details...
✅ 1 Month *₹199npr
✅ 1 Year *₹1449npr

Personal Account:
👉 Email & Password provided
👉 Supports TV
👉 Up to 2 devices for yearly subscription
`;
    } else if (message.includes("canva")) {
      return `Canva subscription details...
🌠 𝐂𝐀𝐍𝐕𝐀 Pro Yearly 🌠

_______________________
▪ On Your Own Mail
▪ Only mail needed
▪ Done Through Invite
▪ Payment via eSewa, Khalti, IMEpay 
▪ May Work More than One Year
--------------------------------------------------------
➡ Price: ₹1999/- ✅
`;
    } else if (message.includes("spotify")) {
      return `Spotify subscription details...
🎶 Unlock the magic of Spotify Premium with amazing sound quality at a great price! 

Price: ₹1669 on your personal Email`;
    } else if (message.includes("disney")) {
      return `Disney+ Hotstar subscription details...
Enjoy premium 4K resolution content for just ₹2699 with VPN (6 months).
✅ Single screen access
✅ Secure OTP-based login
✅ Full warranty coverage`;
    } else if (message.includes("youtube")) {
      return `YouTube Premium details...
Enjoy ad-free content, background play, and YouTube Music with this offer:
~ ₹2999/year
~ ₹1699/6 months

Delivered to your personal email.`;
    } else if (message.includes("hi") || message.includes("hello")) {
      return `Hello! How can I assist you?`;
    } else {
      return `Please reach out to us on WhatsApp by clicking the icon below.`;
    }
  };

  return (
    <>
      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={24} className="text-white" />
        </button>
      </div>

      {/* Bot Chat Icon */}
      <div className="fixed bottom-16 right-5 mb-3">
        {!isOpen && (
          <IconButton
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: "#007bff", color: "white" }}
            aria-label="Open chat"
          >
            <ChatIcon />
          </IconButton>
        )}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-80 bg-gradient-to-b from-blue-600 to-black p-4 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white">Chat with us!</h2>
            <IconButton onClick={() => setIsOpen(false)} size="small" aria-label="Close chat">
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
          </div>
          <div className="chat-window overflow-y-auto h-64 bg-gray-800 p-2 border border-gray-600 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <p
                  className={`text-${message.sender === "user" ? "right" : "left"} text-sm text-white`}
                  style={{ whiteSpace: "pre-line" }}  // Preserve formatting
                >
                  {message.sender === "user" ? "You: " : "Bot: "}
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              placeholder="Type a message..."
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CombinedChat;
