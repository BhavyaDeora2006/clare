import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const RefineGrid = ({
decks,
onSelect,
onRename,
onDelete,
onCreateClick,
loading,
deletingDeckId
}) => {
return (
<div
className={`
w-full rounded-2xl p-8 md:p-10

    shadow-[0_20px_60px_rgba(0,0,0,0.05)]
    shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]

    bg-white/45 border border-[#d6d3d1]/40
  `}
>
  {/* GRID */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {decks.map((deck) => (
      <div
        key={deck.id}
        onClick={() => {
  if (deletingDeckId) return;
  onSelect(deck);
}}
        className={`
          relative group rounded-xl p-5 cursor-pointer

          bg-white/60 border border-[#e7e5e4]/50

          shadow-sm hover:shadow-md
          hover:scale-[1.02]

          transition-all duration-200
        `}
      >
        {/* Title */}
        <h2 className="text-lg font-medium text-stone-800 truncate">
          {deck.title}
        </h2>

        {/* Meta */}
        <p className="text-sm text-[#78716c] mt-1">
  {deck.quizCount === 0
  ? "No quizzes yet"
  : `${deck.quizCount} quiz${deck.quizCount > 1 ? "es" : ""}`}
</p>

<p className="text-xs text-[#a8a29e] mt-1">
  {deck.created_at
    ? new Date(deck.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : ""}
</p>

        {/* ACTIONS */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">
          
          {/* Rename */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename(deck);
            }}
            disabled={loading || deletingDeckId}
            className="
              p-1.5 rounded-md
              bg-[#f5f5f4] text-[#78716c]
              hover:bg-[#e7e5e4]
              hover:text-black
              transition
            "
          >
            <Pencil size={16} strokeWidth={1.5} />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deck.id);
            }}
            disabled={loading || deletingDeckId}
            className="
              p-1.5 rounded-md
              bg-[#f5f5f4] text-[#78716c]
              hover:bg-[#e7e5e4]
              hover:text-red-500
              transition
            "
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* CREATE BUTTON */}
  <div className="flex justify-end mt-10">
    <button
      onClick={onCreateClick}
      disabled={loading || deletingDeckId}
      className={`
        px-6 py-3 rounded-xl text-sm font-medium

        ${
          loading
            ? "bg-[#a8a29e] text-white cursor-wait"
            : "bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white"
        }

        shadow-[0_10px_30px_rgba(138,154,123,0.25)]
        hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]

        transition-all duration-300
      `}
    >
      {loading ? "Creating..." : "+ Create container"}
    </button>
  </div>
</div>


);
};

export default RefineGrid;
