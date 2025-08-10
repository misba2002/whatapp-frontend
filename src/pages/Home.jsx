import React, { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { io } from "socket.io-client";

const API_BASE = "https://whatsapp-backend-l8tf.onrender.com/";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_BASE}api/chats`);
        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMessages(true);

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE}api/messages/${selectedChat}`
        );
        const data = await res.json();
        setMessages((prev) => ({ ...prev, [selectedChat]: data }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // Socket.IO setup
  useEffect(() => {
    const newSocket = io(`${API_BASE}`);
    setSocket(newSocket);

    // Listen for new messages
    newSocket.on("new_message", ({ chatId, message }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (!updated[chatId]) updated[chatId] = [];
        updated[chatId] = [...updated[chatId], message];
        return updated;
      });

      // Update chat preview
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: message.text,
                lastTimestamp: message.timestamp,
                unreadCount:
                  selectedChat === chatId ? 0 : (chat.unreadCount || 0) + 1,
              }
            : chat
        )
      );
    });

    // Listen for message status updates
    newSocket.on("message_status", ({ chatId, msg_id, status }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (updated[chatId]) {
          updated[chatId] = updated[chatId].map((msg) =>
            msg.msg_id === msg_id ? { ...msg, status } : msg
          );
        }
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat]);

  return (
    <div className="flex h-screen">
      {/* Left panel: Chat List */}
      <div className="w-auto border-r">
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={(id) => {
            setSelectedChat(id);
            // Reset unread count for selected chat
            setChats((prev) =>
              prev.map((chat) =>
                chat._id === id ? { ...chat, unreadCount: 0 } : chat
              )
            );
          }}
          loading={loadingChats}
        />
      </div>

      {/* Right panel: Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
