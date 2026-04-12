import React from "react";

const QuizSummary = ({ quizId, responses, onAction }) => {
const total = responses.length;
const correct = responses.filter((r) => r.is_correct).length;
const accuracy = Math.round((correct / total) * 100);

return ( <div className="w-full flex justify-center mt-10">

  <div
    className="
      w-full max-w-2xl

      rounded-2xl p-10 text-center

      bg-white/50
      border border-[#e7e5e4]/50

      shadow-[0_20px_60px_rgba(0,0,0,0.05)]
    "
  >
    {/* Icon */}
    <div className="mb-5 flex justify-center">
      <div
        className="
          w-14 h-14 rounded-full

          bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]

          flex items-center justify-center
          text-white text-xl
          shadow-[0_10px_30px_rgba(138,154,123,0.3)]
        "
      >
        ✓
      </div>
    </div>

    {/* Title */}
    <h2 className="text-2xl font-serif mb-3">
      Quiz Completed!
    </h2>

    {/* Score */}
    <p className="text-xl text-[#57534e] mb-4">
      You scored {correct} out of {total}
    </p>

    {/* Progress bar */}
    <div className="w-full h-2 bg-[#e7e5e4] rounded-full overflow-hidden mb-6">
      <div
        className="h-full bg-[#8a9a7b] transition-all"
        style={{ width: `${accuracy}%` }}
      />
    </div>

    {/* Subtext */}
    <p className="text-sm text-[#78716c] mb-8">
      Review your mistakes to refine your understanding.
    </p>

    {/* Buttons */}
    <div className="flex justify-center gap-4">

  {/* Review */}
  {responses.some(r => !r.is_correct) && (
    <button
      onClick={() => onAction("review", quizId)}
      className="
        px-5 py-2 rounded-lg text-sm font-medium text-white
        bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]
      "
    >
      Review Answers
    </button>
  )}

  {/* Retry */}
  <button
    onClick={() => onAction("start", quizId)}
    className="
      px-5 py-2 rounded-lg text-sm
      border border-[#d6d3d1]
      text-[#57534e]
      hover:bg-white/60
    "
  >
    Retry Quiz
  </button>

  {/* Back */}
  <button
    onClick={() => onAction("back")}
    className="
      px-5 py-2 rounded-lg text-sm
      border border-[#d6d3d1]
      text-[#57534e]
      hover:bg-white/60
    "
  >
    Back to Deck
  </button>

</div>
  </div>
</div>

);
};

export default QuizSummary;
