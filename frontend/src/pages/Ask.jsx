import React, { useState } from "react";
import Navbar from "../components/Navbar";

/* ──────────────────────── CONTEXT BAR ───────────────────── */
const ContextBar = () => (
  <div className="mx-8 mt-3 mb-1 rounded-2xl border border-stone-100 bg-white/70 px-7 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-stone-500">
      <span className="text-stone-400 font-light">Active Context:</span>
      <span className="font-medium text-stone-600">Linked List Notes.pdf</span>
      <span className="text-stone-300 mx-1">|</span>
      <span className="text-stone-400 font-light">Uploaded: 12 pages</span>
    </div>

    <div className="flex items-center gap-6">
      <button className="text-sm text-stone-400 hover:text-stone-600 transition-colors cursor-pointer font-light tracking-wide">
        Change context
      </button>
      <span className="text-stone-200">|</span>
      <button className="text-sm text-stone-400 hover:text-stone-600 transition-colors cursor-pointer font-light tracking-wide">
        Upload new
      </button>
      <button className="p-1 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>
);

/* ──────────────────── MESSAGE BUBBLE ────────────────────── */
const MessageBubble = ({ message }) => {
  if (message.role === "user") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-stone-300 flex-shrink-0 overflow-hidden mt-0.5">
          <img
            src="https://i.pravatar.cc/40?img=47"
            alt="user"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
        <div
          className="px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl rounded-tl-sm text-sm text-stone-600 leading-relaxed max-w-lg"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {message.content}
        </div>
      </div>
    );
  }


  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div
          className="px-6 py-5 bg-white border border-stone-100 rounded-2xl shadow-sm"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          <p className="text-sm text-stone-600 leading-relaxed mb-4">{message.content}</p>
          {message.steps && (
            <ol className="space-y-2 border-t border-stone-100 pt-4">
              {message.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-500 leading-relaxed">
                  <span className="flex-shrink-0 text-stone-300 font-light w-4 text-right">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────── CHAT SECTION ─────────────────────── */
const INITIAL_MESSAGES = [
  {
    role: "user",
    content: "Can you explain how inserting a new node works in a linked list?",
  },
  {
    role: "ai",
    content: "Sure! In a linked list, inserting a new node involves the following steps:",
    steps: [
      "Allocate: Create a new node with the data you want to store.",
      "Traverse: Find the correct spot for the new node based on whether it's being inserted at the beginning, middle, or end.",
      "Link: Update pointers in the previous node (and the new node) to include the new node in the list.",
    ],
  },
];

const ChatSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: inputValue.trim() }]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/60 rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-7 space-y-6">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>

      <div className="border-t border-stone-100 p-5">
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-stone-150 shadow-sm focus-within:border-stone-300 transition-all">
          <button className="p-1 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-stone-600 placeholder:text-stone-300 outline-none"
            style={{ fontFamily: "'Georgia', serif" }}
          />
          <button
            onClick={handleSend}
            className="px-5 py-1.5 text-sm font-light text-white bg-stone-500 rounded-xl hover:bg-stone-600 transition-all cursor-pointer tracking-wide"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── REFERENCE PANEL ───────────────────── */
const REFERENCES = [
  {
    title: "Page 4 — Insertion of Nodes",
    description: "Adding new nodes requires updating the pointers of the surrounding nodes.",
  },
  {
    title: "Page 4 — Insertion Complexity",
    description: "Traversal requires sequential access to the desired position in the list, which limits the insertion efficiency in the worst-case.",
  },
];

const ReferenceCard = ({ reference }) => (
  <div className="p-5 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-200 cursor-pointer">
    <h4
      className="text-sm font-medium text-stone-600 mb-2"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {reference.title}
    </h4>
    <p
      className="text-xs text-stone-400 leading-relaxed"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {reference.description}
    </p>
  </div>
);

const ReferencePanel = () => (
  <div className="flex flex-col h-full bg-white/60 rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
    <div className="px-6 py-5">
      <h3
        className="text-base font-light text-stone-500 tracking-wide"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        From your material
      </h3>
    </div>
    <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
      {REFERENCES.map((ref, i) => (
        <ReferenceCard key={i} reference={ref} />
      ))}
    </div>
  </div>
);

/* ═══════════════════════ ASK PAGE ═════════════════════ */
const Ask = () => (
  <div
    className="flex flex-col h-screen font-sans"
    style={{
      background: "linear-gradient(135deg, #f5f4f2 0%, #edecea 40%, #e8e6e3 100%)",
    }}
  >
    <Navbar />
    <ContextBar />
    <main className="flex-1 overflow-hidden">
      <div className="max-w-6xl mx-auto flex gap-5 px-8 py-5 h-full">
        <div className="flex-[2.2] min-w-0">
          <ChatSection />
        </div>
        <div className="flex-1 min-w-0">
          <ReferencePanel />
        </div>
      </div>
    </main>
  </div>
);

export default Ask;