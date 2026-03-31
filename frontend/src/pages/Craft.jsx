import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { evaluateClarity } from "../utils/clarityEngine";
import bgImage from "../assets/test-light-bg.png";
import { getSession } from '../services/authServices';
const Craft = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState("");
  const [clarity, setClarity] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleGenerate = async () => {
    const result = evaluateClarity(input);

    setClarity(result.score);
    setFeedback(result.feedback);
    setSuggestions(result.suggestions);
    setHasEvaluated(true);
    setSummary(result.summary);

    if (result.score < 100) {
      return;
    }

    setLoading(true);

    try {
      const session = await getSession();

      const res = await fetch("http://localhost:9000/api/learning/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session.access_token}`
        },
        body: JSON.stringify({
          intent: input.trim()
        })
      });
      const data = await res.json();
      console.log("Learning Path:", data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <>
      <Navbar />
=======
    <div>
        <Navbar />
        Craft
    </div>
  )
}
>>>>>>> origin/main

      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          // backgroundColor: "#faf9f6",
          backgroundImage: `url(${bgImage})`,

          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Content */}
      <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">

        <div className="w-full max-w-[1150px]">

          {/* Header */}
          <div className="text-center mb-22 opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]">
            <h1 className={`text-5xl md:text-6xl font-serif tracking-wide mb-5 ${isDark ? "text-stone-200" : "text-stone-800"
              }`}>
              Craft your study intent
            </h1>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
              }`}>
              What you write here is not just for AI.<br />
              It reflects how clearly you understand what you want to learn.
            </p>
          </div>

          {/* Context */}
          <div className="mb-12 text-center max-w-sm mx-auto opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]">
            <p className={`text-xs tracking-wider uppercase mb-3 ${isDark ? "text-[#a8a29e]/70" : "text-[#78716c]/70"
              }`}>
              Before you begin
            </p>

            <p className={`text-sm leading-relaxed ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
              }`}>
              Take a moment to slow down and express what you truly want to understand.
            </p>
          </div>

          {/* Card */}
          <div className={`w-full rounded-2xl p-10 md:p-12 transition-all duration-500 animate-[fadeUp_1s_ease-out_forwards]

  shadow-[0_20px_60px_rgba(0,0,0,0.05)]
  shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]

  ${isDark
              ? "bg-[#292524]/60 border border-[#44403c]/30"
              : "bg-white/45 border border-[#d6d3d1]/40"
            }
`}>

            {/* Input */}
            <div className="mb-12">
              <h2 className={`text-xl font-medium mb-4 ${isDark ? "text-stone-300" : "text-stone-700"
                }`}>
                What do you want to study, and why?
              </h2>

              <textarea
                rows="6"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full rounded-xl p-6 text-[15px] md:text-[16px] leading-relaxed resize-none outline-none transition-all duration-300

  ${isDark
                    ? `
      bg-[#1c1917]/40 
      text-stone-300 
      placeholder-stone-500 
      border border-[#44403c]/50
      focus:border-[#78716c]
      focus:bg-[#1c1917]/50
    `
                    : `
      bg-white/60 
      text-stone-700 
      placeholder-stone-400 
      border border-[#d6d3d1]/50
      focus:border-[#78716c]
      focus:bg-white/75
    `
                  }

  focus:shadow-[0_0_0_1px_rgba(120,113,108,0.2)]
  focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]
`}
                placeholder="Describe what you want to understand, what you already know, and what kind of clarity you are looking for.

  • Example: “I want to study React to build real-world interfaces.
    I already know basic JavaScript, but I struggle with hooks,
    state management, and structuring components for interviews.”"
              />
            </div>

            {hasEvaluated && (
              <div className="mt-10 w-full max-w-[720px] mx-auto flex flex-col items-center gap-3">
                {/* Progress */}
                <div className="mt-6 w-full">

                  {/* Track */}
                  <div className={`relative h-[7px] rounded-full overflow-hidden
    ${isDark
                      ? "bg-[#3f3a36]/80"
                      : "bg-[#e7e5e4]"
                    }
  `}>

                    {/* Base fill */}
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${clarity}%`,
                        background: "linear-gradient(90deg, #7c8c6e 0%, #8a9a7b 50%, #a3b18a 100%)"
                      }}
                    />

                    {/* Soft highlight edge */}
                    <div
                      className="absolute top-0 h-full rounded-full pointer-events-none"
                      style={{
                        width: `${clarity}%`,
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)"
                      }}
                    />

                    {/* Moving light (refined) */}
                    {clarity > 0 && clarity < 100 && (
                      <div
                        className="absolute top-0 h-full w-[20%] opacity-40 blur-[4px]"
                        style={{
                          left: `${Math.max(clarity - 10, 0)}%`,
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)"
                        }}
                      />
                    )}
                  </div>

                </div>
                {/* Feedback */}
                <p className={`mt-3 text-sm tracking-widest ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
                  }`}>
                  {feedback}
                </p>

                {/* Suggestions */}
                {suggestions.length > 0 && clarity < 100 && (
                  <ul className="mt-3 space-y-1 text-xs opacity-80 text-left mx-auto max-w-sm">
                    {suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                )}
                {summary && (
                  <p className="mt-2 text-xs opacity-70 tracking-widest">
                    {summary}
                  </p>
                )}
                <div className="my-10 h-[1px] bg-[#e7e5e4] w-full" />
              </div>

            )}

            {/* Bottom Split */}
            <div className="flex flex-col md:flex-row gap-12">

              {/* Left */}
              <div className="flex-[1.3]">
                <h3 className={`text-lg font-serif mb-4 ${isDark ? "text-stone-300" : "text-stone-700"
                  }`}>
                  Clarity check
                </h3>

                <ul className={`space-y-3 ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
                  }`}>
                  <li>• What do I want to understand?</li>
                  <li>• Why does this matter to me right now?</li>
                  <li>• What do I already know?</li>
                  <li>• What feels confusing or incomplete?</li>
                </ul>
              </div>

              {/* Right */}
              <div className="flex-[0.7] flex flex-col items-start md:items-end">
                <button
                  onClick={handleGenerate}
                  className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-medium transition-all duration-500 ease-out

  ${loading
                      ? `
      bg-[#a8a29e] text-white cursor-wait
      shadow-[0_6px_20px_rgba(0,0,0,0.08)]
    `
                      : `
      bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white

      shadow-[0_10px_30px_rgba(138,154,123,0.25)]
      hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]

      hover:translate-y-[-1px]
      active:translate-y-[0px]

      before:absolute before:inset-0 before:rounded-xl
      before:bg-white/10 before:opacity-0
      hover:before:opacity-100 before:transition-opacity before:duration-500
    `
                    }

  relative overflow-hidden
`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                        Shaping your path...
                      </>
                    ) : (
                      <>
                        Generate my learning path
                        <span className="transition-transform duration-500 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </span>
                </button>

                <p className={`mt-5 text-sm text-right ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
                  }`}>
                  CLARE will generate a structured learning path.<br />
                  You'll be able to refine it before starting.
                </p>
              </div>

            </div>
          </div>

          {/* After */}
          <div className="mt-16 text-center max-w-lg mx-auto opacity-0 animate-[fadeUp_1.2s_ease-out_forwards]">
            <p className={`text-sm leading-relaxed ${isDark ? "text-[#a8a29e]" : "text-[#78716c]"
              }`}>
              Once you define your intent, CLARE will shape a path aligned with your understanding.
            </p>

            <p className="mt-3 text-xs text-[#a8a29e]">
              Your clarity here shapes everything that follows.
            </p>
          </div>

        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(12px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Craft;