"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Search, Phone, Video, Send, MoreVertical } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture?: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: { text: string };
  lastMessageAt: string;
}

interface Message {
  _id: string;
  sender: Participant;
  text: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Participant[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // init socket
  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.sender._id || activeConvId === c._id
            ? { ...c, lastMessage: { text: msg.text }, lastMessageAt: msg.createdAt }
            : c
        )
      );
    });

    return () => { socket.disconnect(); };
  }, [token]);

  // load conversations
  useEffect(() => {
    apiRequest("/chat/conversations").then((res) => {
      if (res.success) setConversations(res.data);
    });
  }, []);

  // load messages when active conv changes
  useEffect(() => {
    if (!activeConvId) return;
    setLoadingMsgs(true);
    socketRef.current?.emit("join_conversation", activeConvId);
    apiRequest(`/chat/conversations/${activeConvId}/messages`).then((res) => {
      if (res.success) setMessages(res.data);
      setLoadingMsgs(false);
    });
    return () => { socketRef.current?.emit("leave_conversation", activeConvId); };
  }, [activeConvId]);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !activeConvId) return;
    const msgText = text;
    setText("");
    const res = await apiRequest(`/chat/conversations/${activeConvId}/messages`, {
      method: "POST",
      body: { text: msgText },
    });
    if (res.success) {
      // add only if socket didn't already deliver it
      setMessages((prev) =>
        prev.find((m) => m._id === res.data._id) ? prev : [...prev, res.data]
      );
      setConversations((prev) =>
        prev.map((c) => c._id === activeConvId ? { ...c, lastMessage: { text: msgText }, lastMessageAt: new Date().toISOString() } : c)
      );
    }
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    const res = await apiRequest(`/users/search?q=${encodeURIComponent(q)}`);
    if (res.success) setSearchResults(res.data || res.users || []);
  };

  const openConversation = async (recipientId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    const res = await apiRequest("/chat/conversations", { method: "POST", body: { recipientId } });
    if (res.success) {
      const conv: Conversation = res.data;
      setConversations((prev) => prev.find((c) => c._id === conv._id) ? prev : [conv, ...prev]);
      setActiveConvId(conv._id);
    }
  };

  const getOther = (conv: Conversation) =>
    conv.participants.find((p) => p._id !== (user?._id || user?.id)) || conv.participants[0];

  const activeConv = conversations.find((c) => c._id === activeConvId);
  const otherUser = activeConv ? getOther(activeConv) : null;

  return (
    <AppShell>
      <div className="flex bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 h-[calc(100vh-8rem)]">

        {/* Sidebar */}
        <div className="w-80 shrink-0 border-r border-gray-100 dark:border-gray-700/50 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mb-3">Chats</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search people..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs rounded-full focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                {searchResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => openConversation(u._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left"
                  >
                    <img src={u.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-8 h-8 rounded-full object-cover" alt={u.firstName} />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-gray-400">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/30">
            {conversations.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No conversations yet.<br />Search for someone to start chatting.</p>
            )}
            {conversations.map((conv) => {
              const other = getOther(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConvId(conv._id)}
                  className={`flex items-center gap-3 p-3.5 w-full text-left transition ${activeConvId === conv._id ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}
                >
                  <img src={other?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0" alt={other?.firstName} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{other?.firstName} {other?.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage?.text || "Say hello!"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        {activeConvId && otherUser ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={otherUser.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-9 h-9 rounded-full object-cover" alt={otherUser.firstName} />
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{otherUser.firstName} {otherUser.lastName}</p>
                  <p className="text-[10px] text-green-500 font-semibold">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"><Phone className="w-4 h-4 text-blue-500" /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"><Video className="w-4 h-4 text-blue-500" /></button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/20">
              {loadingMsgs ? (
                <p className="text-xs text-gray-400 text-center py-4">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No messages yet. Say hello! 👋</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender._id === (user?._id || user?.id);
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600"}`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={handleSend} className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-sm">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation or search for someone to chat with
          </div>
        )}
      </div>
    </AppShell>
  );
}
