import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import bgImage from "../assets/test-light-bg.png";
import DeckGrid from "../components/echo/DeckGrid";
import FlashcardView from "../components/echo/FlashcardView";
import Loader from "../components/Loader";
import {
  fetchDecks,
  createDeck,
  deleteDeck,
  updateDeck,
  fetchSessionCards,
} from "../services/echoService";

import useAsyncAction from "../hooks/useAsyncAction";

const Echo = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  // 🌱 STATE
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loadingDecks, setLoadingDecks] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [error, setError] = useState(null);

  const [showDeckModal, setShowDeckModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const [editingDeck, setEditingDeck] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const MAX_TITLE_LENGTH = 40;

  // 🌱 Async Hooks
  const { loading: creatingDeck, run: runCreateDeck } = useAsyncAction();
  const { loading: renamingDeck, run: runRenameDeck } = useAsyncAction();

  // 🌱 FETCH
  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await fetchDecks();
        setDecks(data);
      } catch (err) {
        setError("Failed to load decks");
      } finally {
        setLoadingDecks(false);
      }
    };
    loadDecks();
  }, []);

  useEffect(() => {
    if (!selectedDeck) return;

    const loadCards = async () => {
      setLoadingCards(true);

  try {
    const data = await fetchSessionCards(selectedDeck.id);
    setCards(data);
    setCurrentIndex(0);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingCards(false);
  }
    };

    loadCards();
  }, [selectedDeck]);

  // 🌱 HANDLERS

  const handleBack = () => {
    setSelectedDeck(null);
    setCards([]);
    setCurrentIndex(0);
  };

  const handleCreateDeck = () => {
    const trimmed = newDeckTitle.trim();
    if (!trimmed) return;

    runCreateDeck(async () => {
      const deck = await createDeck(trimmed);

      setDecks((prev) => [
        ...prev,
        { id: deck.id, title: deck.title, cards: 0, lastReviewed: null },
      ]);

      setShowDeckModal(false);
      setNewDeckTitle("");
    });
  };

  const handleRenameDeck = () => {
    const trimmed = editedTitle.trim();
    if (!trimmed) return;

    runRenameDeck(async () => {
      const updated = await updateDeck(editingDeck.id, trimmed);

      setDecks((prev) =>
        prev.map((d) =>
          d.id === updated.id ? { ...d, title: updated.title } : d
        )
      );

      setEditingDeck(null);
    });
  };

  const handleDeleteDeck = async (deckId) => {
    await deleteDeck(deckId);
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
      />

      <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">
        <div className="w-full max-w-[1150px]">

          {!selectedDeck && (
            <>
              <div className="text-center mb-20">
                <h1 className="text-5xl font-serif mb-5">Echo</h1>
              </div>

              {loadingDecks ? (
                <div className="flex flex-col items-center mt-20 gap-4">
  <Loader size={32} />
  <p className="text-sm text-[#a8a29e]">Loading your memories...</p>
</div>
              ) : (
                <DeckGrid
                  decks={decks}
                  onSelect={setSelectedDeck}
                  onRename={(deck) => {
                    setEditingDeck(deck);
                    setEditedTitle(deck.title);
                  }}
                  onDelete={handleDeleteDeck}
                  onCreateClick={() => setShowDeckModal(true)}
                  loading={creatingDeck}
                />
              )}
            </>
          )}

          {selectedDeck && (
            <>
              <button onClick={handleBack} className="mb-6">
                ← Back
              </button>

              {loadingCards ? (
                <p>Loading cards...</p>
              ) : (
                <FlashcardView
                  deck={selectedDeck}
                  cards={cards}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  setCards={setCards}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showDeckModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/10 backdrop-blur-[3px]"
      onClick={() => !creatingDeck && setShowDeckModal(false)}
    />

    {/* Modal */}
    <div className="
      relative z-10
      w-full max-w-md

      rounded-2xl
      bg-white/80 backdrop-blur-[3px]

      border border-[#e7e5e4]/50
      shadow-[0_20px_60px_rgba(0,0,0,0.12)]

      p-7
      animate-[fadeIn_0.2s_ease]
    ">

      {/* Title */}
      <h2 className="text-xl font-serif text-stone-800 mb-2">
        Capture a memory
      </h2>

      <p className="text-sm text-[#78716c] mb-5">
        Give a name to what you want to remember.
      </p>

      {/* Input */}
      <input
        value={newDeckTitle}
        onChange={(e) => setNewDeckTitle(e.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        placeholder="e.g. Recursion, OS, DBMS..."
        className="
          w-full px-4 py-3 rounded-xl

          bg-white/70
          border border-[#e7e5e4]

          focus:outline-none
          focus:ring-1 focus:ring-[#8a9a7b]

          text-sm
        "
      />
      <p className="text-right text-gray-600">{newDeckTitle.length}/{MAX_TITLE_LENGTH}</p>
      {/* Actions */}
      <div className="flex justify-end gap-3 mt-7">

        {/* Cancel */}
        <button
          onClick={() => setShowDeckModal(false)}
          disabled={creatingDeck}
          className="
            px-4 py-2 rounded-lg text-sm

            text-[#78716c]
            hover:bg-[#f5f5f4]

            transition
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        {/* Save */}
        <button
          onClick={handleCreateDeck}
          disabled={creatingDeck}
          className={`
            px-6 py-2 rounded-lg text-sm font-medium text-white

            ${
              creatingDeck
                ? "bg-[#a8a29e] cursor-wait"
                : "bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]"
            }

            shadow-[0_10px_25px_rgba(138,154,123,0.25)]
            transition
          `}
        >
          {creatingDeck ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </button>

      </div>
    </div>
  </div>
)}

      {/* RENAME MODAL */}
      {editingDeck && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[3px]">

    <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-[3px] border border-[#e7e5e4]/50 shadow-xl p-6">

      {/* Title */}
      <h2 className="text-lg font-medium text-stone-800 mb-4">
        Rename deck
      </h2>

      {/* Input */}
      <input
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        className="w-full px-4 py-2 rounded-lg border border-[#e7e5e4] bg-white/70 focus:outline-none focus:ring-1 focus:ring-[#8a9a7b]"
      />
       <p className="text-right text-gray-600">{editedTitle.length}/{MAX_TITLE_LENGTH}</p>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setEditingDeck(null)}
          disabled={renamingDeck}
          className="px-4 py-2 rounded-lg text-sm text-[#78716c] hover:bg-[#f5f5f4] transition disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleRenameDeck}
          disabled={renamingDeck}
          className={`px-5 py-2 rounded-lg text-sm font-medium text-white

          ${
            renamingDeck
              ? "bg-[#a8a29e] cursor-wait"
              : "bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]"
          }

          transition`}
        >
          {renamingDeck ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </button>

      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Echo;