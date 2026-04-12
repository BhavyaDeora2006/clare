
import React, { useState } from "react";
import Loader from "../Loader";
import { Pencil, Trash2 } from "lucide-react";
import { deleteQuiz, updateQuizTitle } from "../../services/refineService";
const RefineDeckView = ({
deck,
quizzes,
setQuizzes,
loading,
onStartQuiz,
onReviewQuiz,
onUpload,
}) => {
  const [editingQuiz, setEditingQuiz] = useState(null);
const [editedTitle, setEditedTitle] = useState("");
const [renamingQuiz, setRenamingQuiz] = useState(false);

const [deletingQuiz, setDeletingQuiz] = useState(null);
const [deleting, setDeleting] = useState(false);
const MAX_TITLE_LENGTH = 60;

const handleRenameQuiz = async () => {
  if (!editedTitle.trim()) return;

  try {
    setRenamingQuiz(true);

    await updateQuizTitle(editingQuiz.id, editedTitle.trim());

    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editingQuiz.id
          ? { ...q, title: editedTitle.trim() }
          : q
      )
    );

    setEditingQuiz(null);
  } catch (err) {
    console.error("Rename failed", err);
  } finally {
    setRenamingQuiz(false);
  }
};
const handleDeleteQuiz = async () => {
  try {
    setDeleting(true);

    await deleteQuiz(deletingQuiz.id);

    setQuizzes((prev) =>
      prev.filter((q) => q.id !== deletingQuiz.id)
    );

    setDeletingQuiz(null);
  } catch (err) {
    console.error("Delete failed", err);
  } finally {
    setDeleting(false);
  }
};

return ( 
<div className="w-full">

  {/* TITLE */}
  <div className="text-center mb-10">
    <h1 className="text-4xl font-serif mb-6">
      {deck.title}
    </h1>

    {/* Upload */}
    <button
      onClick={onUpload}
      className="
        px-6 py-3 rounded-xl text-sm font-medium text-white

        bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]

        shadow-[0_10px_30px_rgba(138,154,123,0.25)]
        hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]

        transition-all duration-300
      "
    >
      + Upload New Notes
    </button>
  </div>

  {/* CONTAINER */}
  <div
    className="
      w-full rounded-2xl p-6 md:p-8

      bg-white/45
      border border-[#d6d3d1]/40

      shadow-[0_20px_60px_rgba(0,0,0,0.05)]
    "
  >
  <div className="w-full max-w-5xl mx-auto">

  {loading ? (
    <div
      className="
        w-full

        rounded-2xl p-16

        bg-white/50
        border border-[#e7e5e4]/50

        flex flex-col items-center justify-center gap-4
      "
    >
      <Loader size={32} />

      <p className="text-sm text-[#a8a29e]">
        Loading quizzes...
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-5">

  {quizzes.map((quiz) => (
    <div
      key={quiz.id}
      className="
        relative flex items-center justify-between

        rounded-xl p-6

        bg-white/55 backdrop-blur-sm
        border border-[#e7e5e4]/50

        shadow-[0_10px_30px_rgba(0,0,0,0.04)]
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]

        transition-all duration-300
      "
    >

     <div className="flex items-center justify-between w-full">

  {/* LEFT */}
  <div className="flex items-start gap-4">

    {/* ICON */}
    <div className="
      w-10 h-10 rounded-lg
      bg-[#f5f5f4]
      flex items-center justify-center
      text-[#a8a29e]
    ">
      📄
    </div>

    {/* TEXT CONTENT */}
    <div>

      {/* TITLE + ACTIONS */}
      <div className="flex items-center gap-3">

        <h2 className="text-lg font-medium text-stone-800">
          {quiz.title}
        </h2>

        {/* EDIT / DELETE (SUBTLE BUTTONS) */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => {
  setEditingQuiz(quiz);
  setEditedTitle(quiz.title);
}}
            className="
              group

      px-2.5 py-1.5 rounded-md text-xs

      bg-white/70
      border border-[#e7e5e4]

      text-[#78716c]

      shadow-[0_2px_6px_rgba(0,0,0,0.06)]
      hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)]

      hover:bg-white
      hover:text-[#57534e]

      active:scale-[0.97]

      transition-all duration-200
            "
          >
          <Pencil size={16} strokeWidth={1.5} />
          </button>

          <button
          onClick={() => setDeletingQuiz(quiz)}
            className="
              group

      px-2.5 py-1.5 rounded-md text-xs

      bg-white/70
      border border-[#e7e5e4]

      text-[#a8a29e]

      shadow-[0_2px_6px_rgba(0,0,0,0.06)]
      hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)]

      hover:bg-red-50
      hover:text-red-500

      active:scale-[0.97]

      transition-all duration-200
            "
          >
          <Trash2 size={16} strokeWidth={1.5} />
          </button>

        </div>

      </div>

      {/* META */}
      <p className="text-sm text-[#78716c] mt-1">
        {quiz.totalQuestions} questions
        <span className="px-4 text-xs text-[#a8a29e]">
        Last practiced · {
  new Date(quiz.lastAttemptedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
        </span>
      </p>

    </div>

  </div>


  {/* RIGHT ACTIONS */}
  <div className="flex flex-col items-end gap-3">

    {/* START */}
    <button
      onClick={() => onStartQuiz(quiz)}
      className="
        px-5 py-2 rounded-lg text-sm font-medium

        bg-[#8a9a7b]
        text-white

        shadow-[0_6px_20px_rgba(138,154,123,0.25)]
        hover:shadow-[0_10px_30px_rgba(138,154,123,0.35)]

        hover:translate-y-[-1px]
        active:translate-y-[0px]

        transition-all duration-300
      "
    >
      Start Quiz
    </button>

    {/* REVIEW */}
    {quiz.hasAttempt && (
      <button
        onClick={() => onReviewQuiz(quiz)}
        className="
          px-7 py-2 rounded-lg text-sm font-medium text-white

          bg-gradient-to-r from-[#6b85a6] to-[#8fa8c7]

          shadow-[0_8px_20px_rgba(107,133,166,0.25)]
          hover:shadow-[0_12px_28px_rgba(107,133,166,0.35)]

          hover:translate-y-[-1px]
          active:translate-y-[0px]

          transition-all duration-300
        "
      >
        Review
      </button>
    )}

  </div>

</div>

    </div>
  ))}
</div>
  )}
  </div>
</div>
{editingQuiz && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[3px]">

    <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-[3px] border border-[#e7e5e4]/50 shadow-xl p-6">

      <h2 className="text-lg font-medium text-stone-800 mb-4">
        Rename quiz
      </h2>

      <input
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        className="w-full px-4 py-2 rounded-lg border border-[#e7e5e4] bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#8a9a7b]"
      />

      <p className="text-right text-gray-600">
        {editedTitle.length}/{MAX_TITLE_LENGTH}
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setEditingQuiz(null)}
          disabled={renamingQuiz}
          className="px-5 py-2 rounded-lg text-sm font-medium

    bg-gradient-to-r from-[#e7e5e4] to-[#d6d3d1]
    text-[#57534e]

    shadow-[0_4px_12px_rgba(0,0,0,0.08)]
    hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]

    hover:from-[#f5f5f4] hover:to-[#e7e5e4]

    hover:translate-y-[-1px]
    active:translate-y-[0px]

    transition-all duration-300"
        >
          Cancel
        </button>

        <button
          onClick={handleRenameQuiz}
          disabled={renamingQuiz}
          className={`px-5 py-2 rounded-lg text-sm font-medium text-white
          ${
            renamingQuiz
              ? "bg-[#a8a29e] cursor-wait"
              : "bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]"
          }`}
        >
          {renamingQuiz ? "Saving..." : "Save"}
        </button>

      </div>
    </div>
  </div>
)}

{deletingQuiz && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[3px]">

    <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-[3px] border border-[#e7e5e4]/50 shadow-xl p-6 text-center">

      <h2 className="text-lg font-medium text-stone-800 mb-3">
        Delete Quiz?
      </h2>

      <p className="text-sm text-[#78716c] mb-6">
        This action cannot be undone.
      </p>

      <div className="flex justify-center gap-4">

        <button
          onClick={() => setDeletingQuiz(null)}
          disabled={deleting}
          className="px-5 py-2 rounded-lg text-sm font-medium

    bg-gradient-to-r from-[#e7e5e4] to-[#d6d3d1]
    text-[#57534e]

    shadow-[0_4px_12px_rgba(0,0,0,0.08)]
    hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]

    hover:from-[#f5f5f4] hover:to-[#e7e5e4]

    hover:translate-y-[-1px]
    active:translate-y-[0px]

    transition-all duration-300"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteQuiz}
          disabled={deleting}
          className={`
    px-5 py-2 rounded-lg text-sm font-medium text-white

    ${
      deleting
        ? "bg-[#a8a29e] cursor-wait"
        : `
          bg-gradient-to-r from-[#dc2626] to-[#ef4444]

          shadow-[0_8px_20px_rgba(220,38,38,0.25)]
          hover:shadow-[0_12px_28px_rgba(220,38,38,0.35)]

          hover:from-[#b91c1c] hover:to-[#dc2626]
        `
    }

    hover:translate-y-[-1px]
    active:translate-y-[0px]

    transition-all duration-300
  `}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>

      </div>
    </div>
  </div>
)}
</div>

);
};

export default RefineDeckView;
