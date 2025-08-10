import React, { useState } from "react";
import { BsEmojiSmile, BsPaperclip, BsMic, BsSend } from "react-icons/bs";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="h-16 bg-[#f0f2f5] flex items-center px-4 gap-2">
      <BsEmojiSmile size={24} className="text-gray-500 cursor-pointer" />
      <BsPaperclip size={24} className="text-gray-500 cursor-pointer" />
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 outline-none pl-3 pr-10"
        />
      </form>
      {message.trim() ? (
        <button 
          onClick={handleSubmit}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <BsSend size={24} className="text-[#075E54]" />
        </button>
      ) : (
        <BsMic size={24} className="text-gray-500 cursor-pointer" />
      )}
    </div>
  );
}