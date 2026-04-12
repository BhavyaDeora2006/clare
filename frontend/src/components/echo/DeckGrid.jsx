import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const DeckGrid = ({
  decks,
  onSelect,
  onRename,
  onDelete,
  isDark,
  onCreateClick,
  loading, // 🔥 from useAsyncAction
}) => {
  return (
    <div
      className={`w-full rounded-2xl p-8 md:p-10

      shadow-[0_20px_60px_rgba(0,0,0,0.05)]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]

      ${
        isDark
          ? "bg-[#292524]/60 border border-[#44403c]/30"
          : "bg-white/45 border border-[#d6d3d1]/40"
      }`}
    >
      {/* =========================
          DECK GRID
      ========================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => onSelect(deck)}
            className="relative group rounded-xl p-5 cursor-pointer

            bg-white/60 border border-[#e7e5e4]/50

            shadow-sm hover:shadow-md
            hover:scale-[1.02]

            transition-all duration-200"
          >
            {/* Title */}
            <h2 className="text-lg font-medium text-stone-800 truncate">
              {deck.title}
            </h2>

            {/* Meta */}
            <p className="text-sm text-[#78716c] mt-1">
              {deck.cards} cards
            </p>

            <p className="text-xs text-[#a8a29e] mt-2">
              Last reviewed {deck.lastReviewed || "-"}
            </p>

            {/* =========================
                ACTIONS (hover)
            ========================= */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">

              {/* Rename */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(deck);
                }}
                disabled={loading}
                className="
                p-1.5 rounded-md

                bg-[#f5f5f4] text-[#78716c]

                hover:bg-[#e7e5e4]
                hover:text-black

                transition cursor-pointer
                "
              >
                <Pencil size={16} strokeWidth={1.5} />
              </button>

              {/* Delete */}
              <button
              disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(deck.id);
                }}
                className="
                p-1.5 rounded-md

                bg-[#f5f5f4] text-[#78716c]

                hover:bg-[#e7e5e4]
                hover:text-red-500

                transition cursor-pointer
                "
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* =========================
          CREATE BUTTON
      ========================= */}
      <div className="flex justify-end mt-10">
        <button
          onClick={onCreateClick}
          disabled={loading}
          className={`
          px-6 py-3 rounded-xl text-sm font-medium

          relative overflow-hidden

          ${
            loading
              ? `
              bg-[#a8a29e] text-white cursor-wait
              shadow-[0_6px_20px_rgba(0,0,0,0.08)]
            `
              : `
              bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]
              text-white

              shadow-[0_10px_30px_rgba(138,154,123,0.25)]
              hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]

              hover:translate-y-[-1px]
              active:translate-y-[0px]
            `
          }

          transition-all duration-300
        `}
        >
          <span className="flex items-center gap-2">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "+ Capture a memory"
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DeckGrid;