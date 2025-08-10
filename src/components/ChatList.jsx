import React from "react";
import { BiSearch } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatList({ chats, selectedChat, onSelectChat, loading }) {
  return (
    <div className="h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="h-[59px] bg-[#f0f2f5] flex items-center justify-between px-4 py-3 border-b border-[#e9edef]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        </div>
        <div className="flex items-center gap-4 text-[#54656f]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#e9edef] cursor-pointer">
            <BsThreeDotsVertical size={20} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-[#f0f2f5]">
        <div className="flex items-center bg-white rounded-lg px-3 py-1.5 w-full">
          <BiSearch className="text-[#54656f]" size={18} />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-2 outline-none text-sm text-[#3b4a54] placeholder-[#8696a0] bg-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00a884]"></div>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`flex items-center p-3 hover:bg-[#f5f6f6] cursor-pointer border-b border-[#e9edef] ${
                selectedChat === chat._id ? "bg-[#f0f2f5]" : ""
              }`}
              onClick={() => onSelectChat(chat._id)}
            >
              <div className="relative mr-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-[#111b21] truncate">{chat._id}</h2>
                  <span className="text-xs text-[#667781] whitespace-nowrap ml-2">
                    {chat.lastTimestamp &&
                      new Date(chat.lastTimestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-[#667781] truncate pr-2">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#00a884] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}