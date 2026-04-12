import React, { useState, useEffect } from "react";
import {
  createCard,
  updateCard,
  deleteCard,
  fetchSessionCards,
} from "../../services/echoService";
import { Edit3, Trash } from "lucide-react";
import useAsyncAction from "../../hooks/useAsyncAction";
import Loader from "../../components/Loader";
import apiClient from "../../services/apiClient";
const FlashcardView = ({
  deck,
  cards = [],
  currentIndex,
  setCurrentIndex,
  setCards,
}) => {

  // =========================
  // STATE
  // =========================
  const [flipped, setFlipped] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ front: "", back: "" });

  const [editingCard, setEditingCard] = useState(null);
  const [editedCard, setEditedCard] = useState({ front: "", back: "" });

  const [deleting, setDeleting] = useState(false);

  // Async hooks
  const { loading: savingCard, run: runAddCard } = useAsyncAction();
  const { loading: updatingCard, run: runUpdateCard } = useAsyncAction();

  const isEmpty = cards.length === 0;
  const currentCard = cards[currentIndex] || null;

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (currentIndex >= cards.length) {
      setCurrentIndex(0);
    }
  }, [cards]);

  // =========================
  // HANDLERS
  // =========================

  const handleAddCard = () => {
    const front = newCard.front.trim();
    const back = newCard.back.trim();
    if (!front || !back) return;

    runAddCard(async () => {
      const card = await createCard(deck.id, front, back);

      setCards((prev) => [...prev, card]);
      setShowAddCard(false);
      setNewCard({ front: "", back: "" });
    });
  };

  const handleUpdateCard = () => {
    runUpdateCard(async () => {
      const updated = await updateCard(
        editingCard.id,
        editedCard.front,
        editedCard.back
      );

      setCards((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setEditingCard(null);
    });
  };

  const handleDeleteCard = async () => {
    if (!currentCard) return;

    setDeleting(true);

    try {
      await deleteCard(currentCard.id);

      setCards((prev) =>
        prev.filter((c) => c.id !== currentCard.id)
      );

      setFlipped(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleFeedback = async (score) => {
  const currentCardId = cards[currentIndex].id;

  // 🔁 only send feedback
  await apiClient.post(`/cards/${currentCardId}/feedback`, {
    score,
  });

  // 👉 DO NOT refetch cards

  // 👉 just move forward in current session
  setCurrentIndex((prev) =>
    Math.min(prev + 1, cards.length - 1)
  );

  setFlipped(false);
};

  // =========================
  // UI
  // =========================
  return (
    <>
      {/* EMPTY STATE */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center mt-24">
          <p className="text-xl text-[#78716c] mb-2">
            No memories yet
          </p>
          <p className="text-sm text-[#a8a29e] mb-8">
            Start capturing your understanding
          </p>

          <button
            onClick={() => setShowAddCard(true)}
            className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]"
          >
            + Capture memory
          </button>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif text-stone-800">
              {deck.title}
            </h1>

            <p className="text-sm text-[#a8a29e] mt-2">
              {currentIndex + 1} / {cards.length}
            </p>
          </div>

          {/* CARD */}
          <div className="relative w-full max-w-[720px] mx-auto">

            {/* DELETE OVERLAY */}
            {deleting && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                <div className="flex flex-col items-center gap-3">
                  <Loader size={34} />
                  <p className="text-sm text-[#78716c]">
                    Removing memory...
                  </p>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {currentCard && (
              <div className="absolute top-3 right-4 flex gap-2 z-20">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCard(currentCard);
                    setEditedCard({
                      front: currentCard.front,
                      back: currentCard.back,
                    });
                  }}
                  className="p-2 rounded-lg bg-white/80 border shadow hover:scale-105 transition"
                >
                  <Edit3 size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCard();
                  }}
                  className="p-2 rounded-lg bg-white/80 border shadow hover:text-red-500 hover:scale-105 transition"
                >
                  <Trash size={18} />
                </button>

              </div>
            )}

            {/* CARD FLIP */}
            {currentCard && (
              <div className="perspective-[1200px]">
                <div
                  onClick={() => setFlipped(!flipped)}
                  className={`relative w-full h-[240px] transition-transform duration-500 cursor-pointer ${
                    flipped ? "rotate-y-180" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >

                  {/* FRONT */}
<div
  className="absolute inset-0 rounded-2xl flex items-center justify-center text-center p-12 bg-white/60 border shadow"
  style={{
    backfaceVisibility: "hidden",
  }}
>
  <p className="text-2xl">{currentCard.front}</p>
</div>

{/* BACK */}
<div
  className="absolute inset-0 rounded-2xl flex items-center justify-center text-center p-12 bg-white/60 border shadow"
  style={{
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
  }}
>
  <p className="text-2xl">{currentCard.back}</p>
</div>

                </div>
              </div>
            )}
          </div>
{/* FEEDBACK */}
{flipped && (
  <div className="mt-10 flex justify-center gap-3 flex-wrap">

    {["Blank", "Wrong", "Partial", "Good", "Easy"].map((label,idx) => (
      <button
        key={label}
        className="
        px-4 py-2 rounded-full text-sm

        bg-white/60 border border-[#d6d3d1]

        hover:bg-[#8a9a7b]
        hover:text-white

        transition
      "
        onClick={() => {
          console.log("Feedback:", label);
          handleFeedback(idx)
        }}
      >
        {label}
      </button>
    ))}

  </div>
)}  

          {/* NAVIGATION */}
          <div className="mt-12 flex justify-center items-center gap-6">
            <button
              onClick={() => {
                setCurrentIndex((p) => Math.max(p - 1, 0));
                setFlipped(false);
              }}
              className="px-4 py-2 rounded-lg bg-white/40 border hover:bg-white/60 transition"
            >
              ← Previous
            </button>

            <span>{currentIndex + 1} / {cards.length}</span>

            <button
              onClick={() => {
                setCurrentIndex((p) =>
                  Math.min(p + 1, cards.length - 1)
                );
                setFlipped(false);
              }}
              className="px-4 py-2 rounded-lg bg-white/40 border hover:bg-white/60 transition"
            >
              Next →
            </button>
          </div>

          {/* FLOATING ADD */}
          <button
            onClick={() => setShowAddCard(true)}
            className="fixed right-10 bottom-10 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] shadow-lg hover:scale-[1.05] transition"
          >
            + Add Card
          </button>
        </>
      )}

      {/* ADD CARD MODAL */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
  <div className="bg-white border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-2xl p-7 w-full max-w-lg transition-all">

    {/* TITLE */}
    <div className="mb-5">
      <h2 className="text-lg font-medium text-stone-800">
        Capture a memory
      </h2>
      <p className="text-sm text-stone-500 mt-1">
        What do you want to remember?
      </p>
    </div>

    {/* FRONT */}
    <div className="mb-4">
      <label className="text-xs text-stone-500 mb-1 block">
        Front (Prompt)
      </label>

      <textarea
        placeholder="e.g. What is memoization?"
        value={newCard.front}
        onChange={(e) =>
          setNewCard({ ...newCard, front: e.target.value })
        }
        className="
        w-full p-3 rounded-xl
        bg-white/70 border border-stone-200

        focus:outline-none
        focus:ring-2 focus:ring-[#9baf8a]/40
        focus:border-[#9baf8a]

        transition
      "
      />
    </div>

    {/* BACK */}
    <div className="mb-6">
      <label className="text-xs text-stone-500 mb-1 block">
        Back (Answer)
      </label>

      <textarea
        placeholder="e.g. Storing results of expensive function calls..."
        value={newCard.back}
        onChange={(e) =>
          setNewCard({ ...newCard, back: e.target.value })
        }
        className="
        w-full p-3 rounded-xl
        bg-white/70 border border-stone-200

        focus:outline-none
        focus:ring-2 focus:ring-[#9baf8a]/40
        focus:border-[#9baf8a]

        transition
      "
      />
    </div>

    {/* ACTIONS */}
    <div className="flex justify-between items-center">

      {/* subtle cancel */}
      <button
  onClick={() => setShowAddCard(false)}
  disabled={savingCard}
  className="
  px-4 py-2 rounded-lg text-sm font-medium

  bg-white/60 border border-stone-400
  text-stone-600

  hover:bg-white
  hover:text-stone-900

  shadow-[0_4px_12px_rgba(0,0,0,0.04)]
  hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]

  hover:scale-[1.1]

  transition-all duration-200
"
>
  Cancel
</button>

      {/* primary action */}
      <button
        onClick={handleAddCard}
        disabled={savingCard}
        className={`
        px-6 py-2.5 rounded-xl text-sm font-medium

        text-white
        bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]

        shadow-[0_8px_25px_rgba(138,154,123,0.25)]

        hover:scale-[1.02]
        hover:shadow-[0_12px_30px_rgba(138,154,123,0.35)]

        active:scale-[0.97]

        transition-all duration-200
        `}
      >
        {savingCard ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
            Saving...
          </span>
        ) : (
          "Save memory"
        )}
      </button>

    </div>
  </div>
</div>
      )}

      {/* EDIT MODAL */}
     {editingCard && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
    
    <div className="bg-white border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-2xl p-7 w-full max-w-lg transition-all">

      {/* TITLE */}
      <div className="mb-5">
        <h2 className="text-lg font-medium text-stone-800">
          Refine this memory
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Adjust what you understood earlier
        </p>
      </div>

      {/* FRONT */}
      <div className="mb-4">
        <label className="text-xs text-stone-500 mb-1 block">
          Front (Prompt)
        </label>

        <textarea
          value={editedCard.front}
          onChange={(e) =>
            setEditedCard({ ...editedCard, front: e.target.value })
          }
          className="
          w-full p-3 rounded-xl
          bg-[#f8f7f5] border border-stone-200

          focus:outline-none
          focus:ring-2 focus:ring-[#9baf8a]/40
          focus:border-[#9baf8a]

          transition
        "
        />
      </div>

      {/* BACK */}
      <div className="mb-6">
        <label className="text-xs text-stone-500 mb-1 block">
          Back (Answer)
        </label>

        <textarea
          value={editedCard.back}
          onChange={(e) =>
            setEditedCard({ ...editedCard, back: e.target.value })
          }
          className="
          w-full p-3 rounded-xl
          bg-[#f8f7f5] border border-stone-200

          focus:outline-none
          focus:ring-2 focus:ring-[#9baf8a]/40
          focus:border-[#9baf8a]

          transition
        "
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">

        {/* CANCEL */}
        <button
          onClick={() => setEditingCard(null)}
          disabled={updatingCard}
          className="
          px-4 py-2 rounded-lg text-sm font-medium

          bg-white/60 border border-stone-400
          text-stone-600

          hover:bg-white
          hover:text-stone-900

          shadow-[0_4px_12px_rgba(0,0,0,0.04)]
          hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]

          hover:scale-[1.05]

          transition-all duration-200
        "
        >
          Cancel
        </button>

        {/* UPDATE */}
        <button
          onClick={handleUpdateCard}
          disabled={updatingCard}
          className="
          px-6 py-2.5 rounded-xl text-sm font-medium min-w-[140px]

          text-white
          bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]

          shadow-[0_8px_25px_rgba(138,154,123,0.25)]

          hover:scale-[1.02]
          hover:shadow-[0_12px_30px_rgba(138,154,123,0.35)]

          active:scale-[0.97]

          transition-all duration-200
        "
        >
          {updatingCard ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
              Updating...
            </span>
          ) : (
            "Update memory"
          )}
        </button>

      </div>
    </div>
  </div>
)}
    </>
  );
};

export default FlashcardView;