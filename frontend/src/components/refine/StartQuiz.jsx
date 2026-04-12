import React, { useState } from "react";
import QuizSummary from "./QuizSummary";
import { submitAttempt } from "../../services/refineService";
const StartQuiz = ({ quiz, onAction }) => {

  const questions = quiz.questions || [];

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill(null)
  );

  const q = questions[current];
if (current < questions.length && !q) return null;
// Save answer
const handleSelect = (option) => {
const updated = [...answers];
updated[current] = option;
setAnswers(updated);
};

// Next

const handleNext = async () => {
  if (current < quiz.questions.length - 1) {
    setCurrent((prev) => prev + 1);
  } else {
    // ✅ LAST QUESTION → SUBMIT

    const finalResponses = buildResponses();

    try {
      await submitAttempt(quiz.id, finalResponses);

      // move to summary screen
      setCurrent(quiz.questions.length);
    } catch (err) {
      console.error("Submit failed", err);
    }
  }
};

// Prev
const handlePrev = () => {
if (current > 0) {
setCurrent((prev) => prev - 1);
}
};

// ✅ Build responses for summary
const buildResponses = () => {
return questions.map((q, i) => ({
question_text: q.question,
options: q.options,
correct_answer: q.correct_answer,
user_answer: answers[i],
is_correct: answers[i] === q.correct_answer,
}));
};

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

    <p className="text-sm text-[#78716c] mb-2">
      Question {Math.min(current + 1, questions.length)} of {questions.length}
    </p>

    <div className="w-full max-w-md mx-auto h-2 bg-[#e7e5e4] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#8a9a7b]"
        style={{
          width: `${(Math.min(current + 1, questions.length) / questions.length) * 100}%`,
        }}
      />
    </div>
  </div>

  {/* CARD */}
  <div className="
  w-full max-w-5xl mx-auto
  rounded-2xl p-12
  bg-white/50
  border border-[#e7e5e4]/50
  shadow-[0_20px_60px_rgba(0,0,0,0.05)]
">

    {current === questions.length ? (

      <QuizSummary
  quizId={quiz.id}
  responses={buildResponses()}
  onAction={onAction}
/>

    ) : (
      <>
        {/* Question */}
        <h2 className="text-xl font-medium text-center mb-12 text-stone-800">
          {q.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6">

          {q.options.map((opt, i) => {
            const isSelected = answers[current] === opt;

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`
                  px-5 py-3 rounded-lg text-sm text-center
                  border transition

                  ${
                    isSelected
                      ? "bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white"
                      : "bg-white/60 border-[#e7e5e4] text-[#57534e] hover:bg-white/80"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-14">

          <button
            onClick={handlePrev}
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
            {current + 1} / {questions.length}
          </span>

          <button
            onClick={handleNext}
            className="
              px-5 py-2 rounded-lg text-sm border
              border-[#d6d3d1] text-[#57534e] hover:bg-white/60
            "
          >
            {current === questions.length - 1 ? "Finish →" : "Next →"}
          </button>

        </div>
      </>
    )}

  </div>
</div>

);
};

export default StartQuiz;
