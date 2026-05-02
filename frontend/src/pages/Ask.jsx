import React, { useState, useCallback, useRef, useEffect } from "react";
import { askQuestion, formatAiResponse, uploadDocument } from "../services/askService";
import Navbar from "../components/Navbar";
import { usePreferences } from "../context/PreferencesContext";
import bgImage from "../assets/test-light-bg.png";

/* ──────────────────────── CONTEXT BAR ───────────────────── */
const ContextBar = ({ documentName, pageCount, onUploadClick, isDark }) => (
  <div
  className={`mx-8 mt-3 mb-1 rounded-2xl px-7 py-3 flex items-center justify-between transition-colors duration-300 ${
    isDark
      ? "bg-[#292524]/60 border border-[#44403c]/30"
      : "bg-white/80 border border-gray-200 backdrop-blur-md"
  }`}
>
    <div className="flex items-center gap-2 text-sm text-stone-500">
      <span className="text-[#a8a29e] font-light">Active Context:</span>
      {documentName ? (
        <>
          <span className="font-medium text-stone-200">{documentName}</span>
          <span className="text-[#44403c] mx-1">|</span>
          <span className="text-[#a8a29e] font-light">
            { pageCount ? ( <>Uploaded: {pageCount} {pageCount === 1 ? "page" : "pages"}</>) : (<>Processing document...</>) }
          </span>
        </>
      ) : (
        <span className="text-[#a8a29e] italic">No document selected</span>
      )}
    </div>

    <div className="flex items-center gap-6">
      <button onClick={onUploadClick} className="text-sm text-[#a8a29e] hover:text-stone-200 transition-colors cursor-pointer font-light tracking-wide">
        Change context
      </button>
      <span className="text-[#44403c]">|</span>
      <button onClick={onUploadClick} className="text-sm text-[#a8a29e] hover:text-stone-200 transition-colors cursor-pointer font-light tracking-wide">
        Upload new
      </button>
      <button className="p-1 text-[#a8a29e] hover:text-stone-200 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>
);

/* ─────────────── TYPING INDICATOR ───────────────────────── */
const TypingIndicator = ({isDark}) => (
  <div className="flex justify-center">
    <div className="w-full max-w-2xl">
      <div
        className="px-6 py-5 bg-[#1c1917]/60 border border-[#44403c]/30 rounded-2xl shadow-sm font-serif"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#6b7d5e] rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-[#6b7d5e] rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-[#6b7d5e] rounded-full animate-bounce [animation-delay:300ms]" />
          <span className="ml-2 text-xs text-[#a8a29e] font-light">Thinking...</span>
        </div>
      </div>
    </div>
  </div>
);

/* ──────────────── EMPTY STATE ───────────────────────────── */
const EmptyState = ({isDark}) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-md">
      <div
  className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
    isDark ? "bg-[#292524]/80" : "bg-gray-100"
  }`}
>
        <svg className="w-8 h-8 text-[#6b7d5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <h3 className={`text-lg font-light mb-2 font-serif ${
  isDark ? "text-stone-200" : "text-gray-800"
}`}>
        Ask anything about your material
      </h3>
      <p className="text-sm text-[#a8a29e] font-light leading-relaxed">
        Type a question below and I'll find the most relevant information from your uploaded documents.
      </p>
    </div>
  </div>
);

/* ──────────────────── MESSAGE BUBBLE ────────────────────── */
const MessageBubble = ({ message, isDark }) => {
  const { avatarPreview } = usePreferences();

  if (message.role === "user") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#44403c] flex-shrink-0 overflow-hidden mt-0.5">
          <img
            src={avatarPreview}
            alt="user"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
        <div
  className={`px-5 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed max-w-lg font-serif transition-colors duration-300 ${
    isDark
      ? "bg-[#292524]/60 border border-[#44403c]/30 text-stone-200"
      : "bg-gray-100 border border-gray-200 text-gray-800"
  }`}
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
  className={`px-6 py-5 rounded-2xl shadow-sm font-serif transition-colors duration-300 ${
    isDark
      ? "bg-[#1c1917]/60 border border-[#44403c]/30 text-stone-200"
      : "bg-white border border-gray-200 text-gray-800"
  }`}
>
          <p className={`text-sm leading-relaxed mb-4 whitespace-pre-wrap ${
  isDark ? "text-stone-200" : "text-gray-800"
}`}>{message.content}</p>
          {message.steps && (
            <ol className={`space-y-2 pt-4 ${
  isDark ? "border-t border-[#44403c]/30" : "border-t border-gray-200"
}`}>
              {message.steps.map((step, i) => (
                <li className={`flex gap-3 text-sm leading-relaxed ${
  isDark ? "text-[#a8a29e]" : "text-gray-500"
}`}>
                  <span className="flex-shrink-0 text-[#6b7d5e] font-light w-4 text-right">{i + 1}.</span>
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
const ChatSection = ({ onReferencesUpdate, documentId, isDark }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const isDisabled = !documentId;
  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Try Chrome.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputValue((prev) => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

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
    <div
  className={`flex flex-col h-full rounded-3xl shadow-sm overflow-hidden transition-colors duration-300 ${
    isDark
      ? "bg-[#292524]/60 border border-[#44403c]/30"
      : "bg-white/80 backdrop-blur-md border border-gray-200"
  }`}
>
      <div className="flex-1 overflow-y-auto p-7 space-y-6">
        {messages.length === 0 && !isLoading && <EmptyState isDark={isDark}/>}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} isDark={isDark} />
        ))}
        {isLoading && <TypingIndicator isDark={isDark}/>}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#44403c]/30 p-5">
      <div
  className={`flex items-center gap-3 rounded-2xl px-5 py-3 shadow-sm transition-colors duration-300 ${
    isDark
      ? "bg-[#1c1917]/60 border border-[#44403c]/40"
      : "bg-white border border-gray-300"
  } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
>
          <button
            onClick={handleVoiceRecord}
            disabled={isDisabled}
            className={`p-1 transition-colors cursor-pointer ${isRecording ? "text-red-400 animate-pulse" : "text-[#a8a29e] hover:text-stone-200"}`}
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
          <input
            type="text"
  placeholder={isDisabled ? "Upload a document first..." : "Type a message..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isDisabled}
            className={`flex-1 bg-transparent text-sm outline-none disabled:opacity-50 font-serif ${
  isDark
    ? "text-stone-200 placeholder:text-[#78716c]"
    : "text-gray-800 placeholder:text-gray-400"
}`}
 />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim() || isDisabled}
            className="px-5 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] rounded-xl hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)] transition-all cursor-pointer tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── REFERENCE PANEL ───────────────────── */
const ReferenceCard = ({ reference, isDark }) => (
  <div
    className={`p-5 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer ${
      isDark
        ? "bg-[#1c1917]/60 border border-[#44403c]/30 hover:border-[#6b7d5e]/50"
        : "bg-gray-50 border border-gray-200 hover:border-gray-300"
    }`}
  >
    <h4
      className={`text-sm font-medium mb-2 font-serif ${
        isDark ? "text-stone-200" : "text-gray-800"
      }`}
    >
      {reference.title}
    </h4>

    <p
      className={`text-xs leading-relaxed line-clamp-3 font-serif ${
        isDark ? "text-[#a8a29e]" : "text-gray-500"
      }`}
    >
      {reference.description}
    </p>
  </div>
);
const ReferencePanel = ({ references, isDark }) => (
  <div
  className={`flex flex-col h-full rounded-3xl shadow-sm overflow-hidden transition-colors duration-300 ${
    isDark
      ? "bg-[#292524]/60 border border-[#44403c]/30"
      : "bg-white/80 backdrop-blur-md border border-gray-200"
  }`}
>
    <div className="px-6 py-5">
      <h3 className={`text-base font-light tracking-wide font-serif ${
  isDark ? "text-[#a8a29e]" : "text-gray-600"
}`}>
        From your material
      </h3>
    </div>
    <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
      {references.length === 0 ? (
        <div className="flex items-center justify-center h-32">
        <p className={`text-xs font-light italic ${
  isDark ? "text-[#78716c]" : "text-gray-400"
}`}>
            Sources will appear here after you ask a question
          </p>
        </div>
      ) : (
        references.map((ref, i) => (
          <ReferenceCard key={i} reference={ref} isDark={isDark}/>
        ))
      )}
    </div>
  </div>
);

/* ═══════════════════════ ASK PAGE ═════════════════════ */
const Ask = () => {
  const { prefs } = usePreferences();
  const isDark = prefs.theme === "dark";
  const [references, setReferences] = useState([]);
  const [documentId, setDocumentId] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await uploadDocument(file);
      setDocumentId(data.documentId);
      setDocumentName(file.name);
      setPageCount(data.pageCount ?? "?");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans relative">
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-colors duration-500"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(28,25,23,0.88), rgba(28,25,23,0.88)), url(${bgImage})`
            : `url(${bgImage})`,
        }}
      />
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/40' : 'bg-gradient-to-br from-white/20 via-transparent to-black/5'}`} />
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleUpload}
      />
      <ContextBar
        documentName={documentName}
        pageCount={pageCount}
        onUploadClick={() => fileInputRef.current?.click()}
        isDark={isDark}
      />
      <main className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto flex gap-5 px-8 py-5 h-full">
          <div className="flex-[2.2] min-w-0">
            <ChatSection onReferencesUpdate={setReferences} documentId={documentId} isDark={isDark} />
          </div>
          <div className="flex-1 min-w-0">
            <ReferencePanel references={references} isDark={isDark}/>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default Ask;
