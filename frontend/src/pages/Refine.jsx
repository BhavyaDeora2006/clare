import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import bgImage from "../assets/test-light-bg.png";
import RefineGrid from "../components/refine/RefineGrid";
import Loader from "../components/Loader";
import RefineDeckView from "../components/refine/RefineDeckView";
import ReviewQuiz from "../components/refine/ReviewQuiz";
import StartQuiz from "../components/refine/StartQuiz";
import UploadNotesModal from "../components/refine/UploadNotesModal";
import {
  fetchDecks,
  createDeck,
  renameDeck,
  deleteDeck,
  fetchQuizzesByDeck,
  fetchResponses,
  fetchAllQuizzes
} from "../services/refineService";
import { usePreferences } from "../context/PreferencesContext";

const Refine = () => {
  const { prefs } = usePreferences();
  const isDark = prefs.theme === "dark";
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [loadingDecks, setLoadingDecks] = useState(true);

  const [showDeckModal, setShowDeckModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const [editingDeck, setEditingDeck] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const [creatingDeck, setCreatingDeck] = useState(false);
  const [renamingDeck, setRenamingDeck] = useState(false);
  const [deletingDeckId, setDeletingDeckId] = useState(null);

  const [reviewQuiz, setReviewQuiz] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deckQuizzes, setDeckQuizzes] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const MAX_TITLE_LENGTH = 40;

  // =========================
  // FETCH DECKS
  // =========================
  useEffect(() => {
    const loadDecks = async () => {
      try {
        const [deckData, quizData] = await Promise.all([
          fetchDecks(),
          fetchAllQuizzes(),
        ]);

        // 🔥 group quizzes by deck_id
        const quizMap = {};

        quizData.forEach((q) => {
          if (!quizMap[q.deck_id]) {
            quizMap[q.deck_id] = [];
          }
          quizMap[q.deck_id].push(q);
        });

        // 🔥 enrich decks
        const enriched = (deckData || []).map((deck) => ({
          ...deck,
          quizCount: quizMap[deck.id]?.length || 0,
          lastAttemptedAt: deck.last_attempted_at,
        }));

        setDecks(enriched);
      } catch (err) {
        console.error("Failed to fetch decks", err);
      } finally {
        setLoadingDecks(false);
      }
    };
    loadDecks();
  }, []);
  const mapQuiz = (q) => ({
    id: q.id,
    title: q.title,
    totalQuestions: q.total_questions,
    lastAttemptedAt: q.last_attempted_at,
    questions: q.questions_json,
    hasAttempt: !!q.last_attempted_at,
  });

  useEffect(() => {
    if (!selectedDeck) return;

    const loadQuizzes = async () => {
      try {
        setLoadingQuizzes(true);

        const data = await fetchQuizzesByDeck(selectedDeck.id);
        setDeckQuizzes(data.map(mapQuiz));
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    loadQuizzes();
  }, [selectedDeck]);

  // =========================
  // HANDLERS
  // =========================

  const handleQuizAction = async (type, quizId) => {
    if (type === "start") {
      const quiz = deckQuizzes.find((q) => q.id === quizId);

      setReviewQuiz(null);

      // 🔥 FORCE RE-RENDER
      setActiveQuiz(null);
      setTimeout(() => {
        setActiveQuiz(quiz);
      }, 0);
    }

    if (type === "review") {
      const quiz = deckQuizzes.find((q) => q.id === quizId);

      // 🔥 CASE 1: Already in review → just reset
      if (reviewQuiz && reviewQuiz.quiz.id === quizId) {
        setReviewQuiz({
          ...reviewQuiz,
        });
        return;
      }

      // 🔥 CASE 2: Coming from StartQuiz → fetch
      try {
        setLoadingReview(true);

        const responses = await fetchResponses(quizId);

        if (!responses.length) return;

        setActiveQuiz(null);
        setReviewQuiz({
          quiz,
          responses,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReview(false);
      }
    }

    if (type === "back") {
      setActiveQuiz(null);
      setReviewQuiz(null);
    }
  };

  const handleBack = () => {
    setSelectedDeck(null);
    setDeckQuizzes([]);
    setReviewQuiz(null);
    setActiveQuiz(null);
  };

  const handleCreateDeck = async () => {
    const trimmed = newDeckTitle.trim();
    if (!trimmed) return;


    setCreatingDeck(true);

    try {
      const newDeck = await createDeck(trimmed);

      setDecks((prev) => [newDeck, ...prev]);

      setShowDeckModal(false);
      setNewDeckTitle("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingDeck(false);
    }


  };

  const handleRenameDeck = async () => {
    const trimmed = editedTitle.trim();
    if (!trimmed) return;


    setRenamingDeck(true);

    try {
      await renameDeck(editingDeck.id, trimmed);

      setDecks((prev) =>
        prev.map((d) =>
          d.id === editingDeck.id ? { ...d, title: trimmed } : d
        )
      );

      setEditingDeck(null);
    } catch (err) {
      console.error(err);
    } finally {
      setRenamingDeck(false);
    }


  };

  const handleDeleteDeck = async (deckId) => {
    setDeletingDeckId(deckId);


    try {
      await deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingDeckId(null);
    }


  };


  const handleReviewQuiz = async (quiz) => {
    try {
      setLoadingReview(true);

      const responses = await fetchResponses(quiz.id);

      if (!responses.length) {
        setLoadingReview(false); // 🔥 FIX
        return;
      }

      setReviewQuiz({
        quiz,
        responses,
      });
    } catch (err) {
      console.error("Failed to fetch responses", err);
    } finally {
      setLoadingReview(false);
    }
  };



  // =========================
  // RENDER
  // =========================

  return (
    <> <Navbar />


      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-colors duration-500"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(28,25,23,0.88), rgba(28,25,23,0.88)), url(${bgImage})`
            : `url(${bgImage})`,
        }}
      />
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/40' : 'bg-gradient-to-br from-white/20 via-transparent to-black/5'}`} />
      {loadingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
          <Loader size={36} />
        </div>
      )}
      {/* ================= START QUIZ ================= */}
      {activeQuiz ? (
        <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">
          <div className="w-full max-w-[1150px]">
            <StartQuiz
              quiz={activeQuiz}
              onAction={handleQuizAction}
            />
          </div>
        </div>
      ) : reviewQuiz ? (
        /* ================= REVIEW ================= */
        <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">
          <div className="w-full max-w-[1150px]">
            <ReviewQuiz
              quiz={reviewQuiz.quiz}
              responses={reviewQuiz.responses}
              onAction={handleQuizAction}
            />
          </div>
        </div>
      ) : (
        <>
          {/* ================= MAIN ================= */}
          <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">
            <div className="w-full max-w-[1150px]">

              {!selectedDeck && (
                <>
                  <div className="text-center mb-20">
                    <h1 className={`text-5xl font-serif mb-5 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>Refine</h1>
                    <p className={`text-sm ${isDark ? 'text-[#a8a29e]' : 'text-[#78716c]'}`}>
                      Choose a space to test your understanding.
                    </p>
                  </div>

                  {loadingDecks ? (
                    <div className="flex flex-col items-center mt-20 gap-4">
                      <Loader size={32} />
                      <p className="text-sm text-[#a8a29e]">
                        Loading your spaces...
                      </p>
                    </div>
                  ) : (
                    <RefineGrid
                      decks={decks}
                      onSelect={setSelectedDeck}
                      onCreateClick={() => setShowDeckModal(true)}
                      onRename={(deck) => {
                        setEditingDeck(deck);
                        setEditedTitle(deck.title);
                      }}
                      onDelete={handleDeleteDeck}
                      loading={creatingDeck || renamingDeck}
                      deletingDeckId={deletingDeckId}
                    />
                  )}
                </>
              )}

              {selectedDeck && (
                <>
                  <button onClick={handleBack} className="mb-6">
                    ← Back
                  </button>

                  <RefineDeckView
                    deck={selectedDeck}
                    quizzes={deckQuizzes}
                    setQuizzes={setDeckQuizzes}
                    loading={loadingQuizzes}
                    onReviewQuiz={handleReviewQuiz}
                    onStartQuiz={(quiz) => setActiveQuiz(quiz)}
                    onUpload={() => setShowUploadModal(true)}
                  />
                </>
              )}

            </div>
          </div>

          {/* ================= UPLOAD MODAL ================= */}
          {showUploadModal && selectedDeck && (
            <UploadNotesModal
              deckId={selectedDeck.id}
              onClose={() => setShowUploadModal(false)}
              onSuccess={async () => {
                const data = await fetchQuizzesByDeck(selectedDeck.id);

                const mapped = data.map((q) => ({
                  id: q.id,
                  title: q.title,
                  totalQuestions: q.total_questions,
                  lastAttemptedAt: q.last_attempted_at,
                  questions: q.questions_json,

                  // 🔥 THIS IS KEY
                  hasAttempt: !!q.last_attempted_at,
                }));

                setDeckQuizzes(mapped);
              }}
            />
          )}

          {/* ================= CREATE MODAL ================= */}
          {showDeckModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">

              <div
                className="absolute inset-0 bg-black/10 backdrop-blur-[3px]"
                onClick={() => setShowDeckModal(false)}
              />

              <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-[3px] border border-[#e7e5e4]/50 shadow-xl p-7">

                <h2 className="text-xl font-serif mb-2">
                  Create a refinement space
                </h2>

                <input
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  maxLength={MAX_TITLE_LENGTH}
                  className="w-full px-4 py-3 rounded-xl border border-[#e7e5e4]"
                />

                <p className="text-right text-sm text-gray-500 mt-1">
                  {newDeckTitle.length}/{MAX_TITLE_LENGTH}
                </p>

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    onClick={() => setShowDeckModal(false)}
                    className="px-4 py-2 text-sm text-[#78716c]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCreateDeck}
                    disabled={creatingDeck}
                    className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a]"
                  >
                    {creatingDeck ? "Creating..." : "Save"}
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* ================= RENAME MODAL ================= */}
          {editingDeck && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[3px]">

              <div className="w-full max-w-md rounded-2xl bg-white/80 p-6 border shadow-xl">

                <h2 className="text-lg mb-4">Rename container</h2>

                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border"
                />

                <div className="flex justify-end gap-3 mt-6">

                  <button onClick={() => setEditingDeck(null)}>
                    Cancel
                  </button>

                  <button onClick={handleRenameDeck}>
                    Save
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* ================= DELETE LOADER ================= */}
          {deletingDeckId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
              <Loader size={36} />
            </div>
          )}

        </>
      )}
    </>


  );
};

export default Refine;
