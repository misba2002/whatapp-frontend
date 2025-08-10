import React, { useState, useEffect } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { io } from "socket.io-client";
import { BiSearch, BiSmile } from "react-icons/bi";

import { BsThreeDotsVertical, BsPaperclip } from "react-icons/bs";


export default function ChatWindow({ selectedChat, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  // Connect to Socket.IO when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const newSocket = io("https://whatsapp-backend-l8tf.onrender.com/");
    setSocket(newSocket);

    // Listen for message status updates
    newSocket.on("message_status", ({ chatId, msg_id, status }) => {
      if (chatId === selectedChat) {
        setMessages((prev) => {
          const updated = { ...prev };
          if (updated[chatId]) {
            updated[chatId] = updated[chatId].map((msg) =>
              msg.msg_id === msg_id ? { ...msg, status } : msg
            );
          }
          return updated;
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    // Emit to backend via Socket.IO
    socket.emit("send_message", { chatId: selectedChat, text: input });

    // Optimistic UI update
    const newMsg = {
      msg_id: "temp_" + Date.now(),
      from: "me",
      text: input,
      timestamp: Date.now(),
      status: "sending",
    };
    setMessages((prev) => {
      const updated = { ...prev };
      if (!updated[selectedChat]) updated[selectedChat] = [];
      updated[selectedChat] = [...updated[selectedChat], newMsg];
      return updated;
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5] bg-opacity-30 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')]">
      {/* Header */}
      {selectedChat && (
        <div className="h-[59px] bg-[#f0f2f5] flex items-center px-4 py-2 border-b border-[#e9edef]">
          <div className="flex items-center w-full">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div className="flex-1">
              <h2 className="font-medium text-[#111b21]">{selectedChat}</h2>
              <p className="text-xs text-[#667781]">last seen today at 12:34 PM</p>
            </div>
            <div className="flex items-center gap-4 text-[#54656f]">
              <BiSearch size={20} className="cursor-pointer" />
              <BsThreeDotsVertical size={20} className="cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 pb-2">
        <div className="flex flex-col space-y-1">
          {messages[selectedChat]?.map((msg) => (
            <div
              key={msg.msg_id}
              className={`flex mb-1 ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 px-3 rounded-lg max-w-[65%] relative ${
                  msg.from === "me"
                    ? "bg-[#d9fdd3] rounded-tr-none"
                    : "bg-white rounded-tl-none"
                }`}
              >
                <p className="text-[#111b21]">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-xs text-[#667781]">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.from === "me" && (
                    <IoCheckmarkDoneSharp
                      className={
                        msg.status === "read"
                          ? "text-[#53bdeb]"
                          : "text-[#667781]"
                      }
                      size={16}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      {selectedChat && (
  <div className="bg-[#f0f2f5] p-3 flex items-center">
    <div className="flex items-center gap-2 mr-2">
      <BiSmile size={24} className="text-[#54656f] cursor-pointer" />
      <BsPaperclip size={24} className="text-[#54656f] cursor-pointer" />
    </div>
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type a message"
      className="flex-1 border-0 rounded-lg px-4 py-2 outline-none bg-white text-[#111b21] placeholder-[#8696a0]"
    />
    <button
      onClick={sendMessage}
      style={{backgroundColor:"lightgreen"}}
      className="
    ml-2 
    w-10 h-10 
    rounded-full 
    flex items-center justify-center 
    text-green 
    shadow-md
    hover:bg-[#007f67] 
    transition-colors duration-200
    active:scale-95
    cursor-pointer
  "
    >
    Send
    </button>
  </div>
)}
    </div>
  );
}