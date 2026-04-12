import React, { useEffect, useState } from "react";
import QuizSummary from "./QuizSummary";

const ReviewQuiz = ({ quiz, responses, onAction }) => {
const [current, setCurrent] = useState(0);

const q = responses[current] || {};
useEffect(() => {
  setCurrent(0);
}, [responses]);
return ( <div className="w-full">

  {/* Back */}
  <button onClick={()=>onAction('back')} className="mb-6">
    ← Back
  </button>

  {/* Title */}
  <div className="text-center mb-10">
    <h1 className="text-4xl font-serif mb-4">
      {quiz.title}
    </h1>

    {/* Progress */}
    <p className="text-sm text-[#78716c] mb-2">
      Question {current < responses.length ? current+1 : current} of {responses.length}
    </p>

    <div className="w-full max-w-md mx-auto h-2 bg-[#e7e5e4] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#8a9a7b] transition-all"
        style={{
          width: `${((current + 1) / responses.length) * 100}%`,
        }}
      />
    </div>
  </div>

  {/* CARD */}
  <div
    className="
      w-full max-w-5xl mx-auto

      rounded-2xl p-12

      bg-white/50
      border border-[#e7e5e4]/50

      shadow-[0_20px_60px_rgba(0,0,0,0.05)]
    "
  >
  
    {current === responses.length ? (
  <QuizSummary
    quizId={quiz.id}
    responses={responses}
    onAction={(type) => {
      if (type === "review") {
        setCurrent(0); // 🔥 KEY FIX
      }

      if (type === "start") {
        onAction('start', quiz.id); // go to start quiz
      }

      if (type === "back") {
        onAction('back')
      }
    }}
  />
) : (
  <>
    {/* Question */}
    <h2 className="text-xl font-medium text-center mb-10 text-stone-800">
      {q.question_text}
    </h2>

    {/* Options */}
    <div className="grid grid-cols-2 gap-5">
      {q.options.map((opt, i) => {
        const isUser = opt === q.user_answer;
        const isCorrect = opt === q.correct_answer;

        let style = `
          px-5 py-3 rounded-lg text-sm text-center
          border transition
          bg-white/60 border-[#e7e5e4] text-[#57534e]
        `;

        if (isCorrect) {
          style = `
            px-5 py-3 rounded-lg text-sm text-center text-white
            bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]
          `;
        } else if (isUser) {
          style = `
            px-5 py-3 rounded-lg text-sm text-center text-white
            bg-gradient-to-r from-[#d97777] to-[#ef4444]
          `;
        }

        return (
          <div key={i} className={style}>
            {opt}
          </div>
        );
      })}
    </div>

    {/* Navigation */}
    <div className="flex items-center justify-center gap-6 mt-12">

      <button
        onClick={() => setCurrent((prev) => prev - 1)}
        disabled={current === 0}
        className={`
          px-5 py-2 rounded-lg text-sm border
          ${
            current === 0
              ? "border-[#e7e5e4] text-[#a8a29e]"
              : "border-[#d6d3d1] text-[#57534e] hover:bg-white/60"
          }
        `}
      >
        ← Previous
      </button>

      <span className="text-sm text-[#78716c]">
        {current + 1} / {responses.length}
      </span>

      <button
        onClick={() => setCurrent((prev) => prev + 1)}
        className="
          px-5 py-2 rounded-lg text-sm border
          border-[#d6d3d1] text-[#57534e] hover:bg-white/60
        "
      >
        {current === responses.length - 1 ? "Finish →" : "Next →"}
      </button>

    </div>
  </>
)}
  </div>
</div>


);
};

export default ReviewQuiz;
