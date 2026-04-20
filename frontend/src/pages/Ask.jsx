import React, { useState, useCallback, useRef, useEffect } from "react";
import { askQuestion, formatAiResponse } from "../services/askService";
import Navbar from "../components/Navbar";

/* ──────────────────────── CONTEXT BAR ───────────────────── */
const ContextBar = ({ documentName, pageCount }) => (
  <div className="mx-8 mt-3 mb-1 rounded-2xl border border-stone-100 bg-white/70 px-7 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-stone-500">
      <span className="text-stone-400 font-light">Active Context:</span>
      {documentName ? (
        <>
          <span className="font-medium text-stone-600">{documentName}</span>
          <span className="text-stone-300 mx-1">|</span>
          <span className="text-stone-400 font-light">
            Uploaded: {pageCount} {pageCount === 1 ? "page" : "pages"}
          </span>
        </>
      ) : (
        <span className="text-stone-400 italic">No document selected</span>
      )}
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

/* ─────────────── TYPING INDICATOR ───────────────────────── */
const TypingIndicator = () => (
  <div className="flex justify-center">
    <div className="w-full max-w-2xl">
      <div
        className="px-6 py-5 bg-white border border-stone-100 rounded-2xl shadow-sm"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          <span className="ml-2 text-xs text-stone-400 font-light">Thinking...</span>
        </div>
      </div>
    </div>
  </div>
);

/* ──────────────── EMPTY STATE ───────────────────────────── */
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-stone-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <h3 className="text-lg font-light text-stone-500 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
        Ask anything about your material
      </h3>
      <p className="text-sm text-stone-400 font-light leading-relaxed">
        Type a question below and I'll find the most relevant information from your uploaded documents.
      </p>
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
          <p className="text-sm text-stone-600 leading-relaxed mb-4 whitespace-pre-wrap">{message.content}</p>
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
const ChatSection = ({ onReferencesUpdate, documentId }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    const question = inputValue.trim();
    if (!question || isLoading) return;

    // Append user message (no placeholder — we use TypingIndicator component)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await askQuestion(question, documentId);
      const chatMessage = formatAiResponse(data);

      // Append the real AI response
      setMessages((prev) => [...prev, chatMessage]);

      // Update reference panel with sources from the AI response
      if (chatMessage.sources?.length > 0 && onReferencesUpdate) {
        onReferencesUpdate(chatMessage.sources);
      }
    } catch (err) {
      console.error("Ask error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, onReferencesUpdate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/60 rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-7 space-y-6">
        {messages.length === 0 && !isLoading && <EmptyState />}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
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
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-stone-600 placeholder:text-stone-300 outline-none disabled:opacity-50"
            style={{ fontFamily: "'Georgia', serif" }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="px-5 py-1.5 text-sm font-light text-white bg-stone-500 rounded-xl hover:bg-stone-600 transition-all cursor-pointer tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── REFERENCE PANEL ───────────────────── */
const ReferenceCard = ({ reference }) => (
  <div className="p-5 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-200 cursor-pointer">
    <h4
      className="text-sm font-medium text-stone-600 mb-2"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {reference.title}
    </h4>
    <p
      className="text-xs text-stone-400 leading-relaxed line-clamp-3"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {reference.description}
    </p>
  </div>
);

const ReferencePanel = ({ references }) => (
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
      {references.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-xs text-stone-300 font-light italic">
            Sources will appear here after you ask a question
          </p>
        </div>
      ) : (
        references.map((ref, i) => (
          <ReferenceCard key={i} reference={ref} />
        ))
      )}
    </div>
  </div>
);

/* ═══════════════════════ ASK PAGE ═════════════════════ */
const Ask = () => {
  const [references, setReferences] = useState([]);
  const [documentId, setDocumentId] = useState(null);

  return (
    <div
      className="flex flex-col h-screen font-sans"
      style={{
        background: "linear-gradient(135deg, #f5f4f2 0%, #edecea 40%, #e8e6e3 100%)",
      }}
    >
      <Navbar />
      <ContextBar documentName="Linked List Notes.pdf" pageCount={12} />
      <main className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto flex gap-5 px-8 py-5 h-full">
          <div className="flex-[2.2] min-w-0">
            <ChatSection onReferencesUpdate={setReferences} documentId={documentId} />
          </div>
          <div className="flex-1 min-w-0">
            <ReferencePanel references={references} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ask;