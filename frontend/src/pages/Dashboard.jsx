import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import bgImage from "../assets/test-light-bg.png";
import { supabase } from "../services/supabaseClient";
import { usePreferences } from "../context/PreferencesContext";


/* ═══════════════════════════════════════════════════
   PROGRESS BAR — matching Craft clarity bar
   ═══════════════════════════════════════════════════ */
const ProgressBar = ({ percent }) => (
  <div className="relative h-[7px] rounded-full overflow-hidden bg-[#e7e5e4]">
    <div
      className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
      style={{
        width: `${percent}%`,
        background:
          "linear-gradient(90deg, #7c8c6e 0%, #8a9a7b 50%, #a3b18a 100%)",
      }}
    />
    <div
      className="absolute top-0 h-full rounded-full pointer-events-none"
      style={{
        width: `${percent}%`,
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
      }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════
   LEARNING PATH CARD
   ═══════════════════════════════════════════════════ */
const LearningPathCard = ({ path, onContinue, isDark }) => {
  const structure = path.structure || {};
  const chapters = structure.chapters || [];
  const totalTopics = chapters.reduce(
    (acc, ch) => acc + (ch.topics?.length || 0),
    0
  );
  const completedTopics = chapters.reduce(
    (acc, ch) =>
      acc + (ch.topics?.filter((t) => t.completed)?.length || 0),
    0
  );
  const progress = path.progress || 0;

  return (
    <div
      className={`
        rounded-2xl p-7
        ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
        shadow-[0_20px_60px_rgba(0,0,0,0.05)]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
      `}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className={`text-[17px] font-semibold m-0 tracking-tight ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
          {path.title}
        </h3>
        <span className={`text-[13px] font-medium shrink-0 ml-4 ${isDark ? 'text-[#a8a29e]' : 'text-[#a8a29e]'}`}>
          {progress}%
        </span>
      </div>

      <p className={`text-[12px] m-0 mb-5 ${isDark ? 'text-[#a8a29e]' : 'text-[#a8a29e]'}`}>
        {completedTopics} of {totalTopics} topics completed
      </p>

      <ProgressBar percent={progress} />

      {/* Chapter breakdown */}
      <div className="mt-5 flex flex-col gap-2">
        {chapters.slice(0, 3).map((ch) => {
          const done = ch.topics?.filter((t) => t.completed)?.length || 0;
          const total = ch.topics?.length || 0;
          return (
            <div
              key={ch.id}
              className="flex items-center justify-between text-[12px]"
            >
              <span className={`truncate mr-3 ${isDark ? 'text-[#a8a29e]' : 'text-stone-600'}`}>{ch.title}</span>
              <span className={`shrink-0 ${isDark ? 'text-[#78716c]' : 'text-[#a8a29e]'}`}>
                {done}/{total}
              </span>
            </div>
          );
        })}
        {chapters.length > 3 && (
          <span className={`text-[11px] ${isDark ? 'text-[#78716c]' : 'text-[#a8a29e]'}`}>
            +{chapters.length - 3} more chapters
          </span>
        )}
      </div>

      <button
        onClick={() => onContinue(path)}
        className={`
          mt-6 w-full py-3 rounded-xl text-[13px] font-medium
          bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white
          shadow-[0_10px_30px_rgba(138,154,123,0.25)]
          hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]
          hover:translate-y-[-1px] active:translate-y-0
          transition-all duration-300 cursor-pointer border-none
        `}
      >
        Continue learning →
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════════════
   RECOMMENDED NEXT STEP CARD
   ═══════════════════════════════════════════════════ */
const NextStepCard = ({ path, navigate, isDark }) => {
  if (!path) return null;

  const structure = path.structure || {};
  const chapters = structure.chapters || [];

  // Find the first incomplete topic
  let nextChapter = null;
  let nextTopic = null;
  for (const ch of chapters) {
    for (const t of ch.topics || []) {
      if (!t.completed) {
        nextChapter = ch;
        nextTopic = t;
        break;
      }
    }
    if (nextTopic) break;
  }

  if (!nextTopic) {
    return (
      <div
        className={`
          rounded-2xl p-8 text-center
          ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-gradient-to-br from-[#f4f6f1] to-[#eef0eb] border border-[#d6d3d1]/40'}
          shadow-[0_20px_60px_rgba(0,0,0,0.05)]
        `}
      >
        <span className="text-[32px] block mb-3">🎉</span>
        <h3 className={`text-[17px] font-semibold m-0 mb-2 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
          All caught up!
        </h3>
        <p className={`text-[13px] m-0 mb-5 ${isDark ? 'text-[#a8a29e]' : 'text-[#78716c]'}`}>
          You've completed all topics. Start a new learning path.
        </p>
        <button
          onClick={() => navigate("/craft")}
          className="px-6 py-3 rounded-xl text-[13px] font-medium bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white shadow-[0_10px_30px_rgba(138,154,123,0.25)] hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)] transition-all duration-300 cursor-pointer border-none"
        >
          Craft a new intent →
        </button>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl p-7 relative overflow-hidden
        ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-gradient-to-br from-[#f4f6f1] to-[#eef0eb] border border-[#c5cebf]/40'}
        shadow-[0_20px_60px_rgba(0,0,0,0.05)]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
      `}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8a9a7b] to-[#a3b18a] rounded-t-2xl" />

      <p className="text-[11px] text-[#8a9a7b] uppercase tracking-[0.12em] font-semibold m-0 mb-3 mt-1">
        Recommended next step
      </p>
      <h3 className={`text-[18px] font-serif m-0 mb-2 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
        {nextTopic.title}
      </h3>
      <p className={`text-[12px] m-0 mb-1 ${isDark ? 'text-[#a8a29e]' : 'text-[#78716c]'}`}>
        {nextChapter.title} · <span className="italic">{path.title}</span>
      </p>
      <p className={`text-[12px] m-0 mb-6 ${isDark ? 'text-[#78716c]' : 'text-[#a8a29e]'}`}>
        Pick up where you left off and keep your momentum going.
      </p>

      <button
        onClick={() => navigate("/learn")}
        className={`
          px-6 py-3 rounded-xl text-[13px] font-medium
          bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white
          shadow-[0_10px_30px_rgba(138,154,123,0.25)]
          hover:shadow-[0_14px_40px_rgba(138,154,123,0.35)]
          hover:translate-y-[-1px] active:translate-y-0
          transition-all duration-300 cursor-pointer border-none
        `}
      >
        Continue this lesson →
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════════ */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { prefs } = usePreferences();
  const isDark = prefs.theme === 'dark';
  const noMotion = prefs.reduce_motion === true;

  const [loading, setLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState([]);
  const [echoDecks, setEchoDecks] = useState([]);
  const [refineDecks, setRefineDecks] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Get user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserName(
            user.user_metadata?.full_name?.split(" ")[0] ||
            user.email?.split("@")[0] ||
            "there"
          );
        }

        // Fetch learning paths from supabase directly
        const { data: paths } = await supabase
          .from("learning_paths")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        setLearningPaths(paths || []);

        // Fetch echo decks, refine decks, quizzes in parallel
        // const [echoData, refineData, quizData] = await Promise.allSettled([
        //   fetchEchoDecks(),
        //   fetchRefineDecks(),
        //   fetchAllQuizzes(),
        // ]);

        // setEchoDecks(echoData.status === "fulfilled" ? echoData.value || [] : []);
        // setRefineDecks(refineData.status === "fulfilled" ? refineData.value || [] : []);
        // setQuizzes(quizData.status === "fulfilled" ? quizData.value || [] : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  /* ── Derived data ── */
  const totalLessonsCompleted = learningPaths.reduce((acc, p) => {
    const chapters = p.structure?.chapters || [];
    return (
      acc +
      chapters.reduce(
        (a, ch) => a + (ch.topics?.filter((t) => t.completed)?.length || 0),
        0
      )
    );
  }, 0);

  const totalTopics = learningPaths.reduce((acc, p) => {
    const chapters = p.structure?.chapters || [];
    return acc + chapters.reduce((a, ch) => a + (ch.topics?.length || 0), 0);
  }, 0);

  const overallProgress =
    totalTopics > 0
      ? Math.round((totalLessonsCompleted / totalTopics) * 100)
      : 0;

  // Most recent active path (for next step)
  const activePath =
    learningPaths.find((p) => p.progress < 100) || learningPaths[0] || null;


  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Navbar />

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

      {/* Content */}
      <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-6 relative z-10">
        <div className="w-full max-w-[1150px] relative">

          {/* Header */}
          <div className={`text-center mb-16 ${noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.6s_ease-out_forwards]'}`}>
            <h1 className={`text-5xl md:text-6xl font-serif tracking-wide mb-5 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
              {greeting}, {userName}
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-stone-200' : 'text-[#78716c]'}`}>
              Here's an overview of your learning journey.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center mt-20 gap-4">
              <Loader size={32} />
              <p className="text-sm text-[#a8a29e]">Loading your dashboard...</p>
            </div>
          ) : (
            <>

              {/* ─── Overall Progress ─── */}
              {totalTopics > 0 && (
                <div
                  className={`
                    rounded-2xl p-7 mb-10
                    ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
                    shadow-[0_20px_60px_rgba(0,0,0,0.05)]
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]
                    ${noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.8s_ease-out_0.15s_forwards]'}
                  `}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className={`text-xl font-medium m-0 ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                      Overall Progress
                    </h2>
                    <span className="text-[14px] text-[#78716c]">
                      {totalLessonsCompleted} of {totalTopics} topics ·{" "}
                      {overallProgress}%
                    </span>
                  </div>
                  <ProgressBar percent={overallProgress} />
                </div>
              )}

              {/* ─── Two-column grid: Learning Paths + Right column ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
                {/* Left: Learning Paths */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* Section header */}
                  <div className={`flex items-center justify-between ${noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.8s_ease-out_0.2s_forwards]'}`}>
                    <h2 className={`text-xl font-medium m-0 ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                      Learning Paths
                    </h2>
                    <button
                      onClick={() => navigate("/craft")}
                      className="text-[12px] text-[#8a9a7b] font-medium bg-transparent border-none cursor-pointer hover:text-[#6b7d5e] transition-colors tracking-wide"
                    >
                      + New path
                    </button>
                  </div>

                  {learningPaths.length === 0 ? (
                    <div
                      className={`
                        rounded-2xl p-10 text-center
                        ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
                        shadow-[0_20px_60px_rgba(0,0,0,0.05)]
                        ${noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.8s_ease-out_0.25s_forwards]'}
                      `}
                    >
                      <span className="text-[36px] block mb-3">🌱</span>
                      <p className={`text-[14px] m-0 mb-5 ${isDark ? 'text-[#a8a29e]' : 'text-[#78716c]'}`}>
                        No learning paths yet. Craft your first study intent to
                        get started.
                      </p>
                      <button
                        onClick={() => navigate("/craft")}
                        className="px-6 py-3 rounded-xl text-[13px] font-medium bg-gradient-to-r from-[#8a9a7b] to-[#9baf8a] text-white shadow-[0_10px_30px_rgba(138,154,123,0.25)] transition-all duration-300 cursor-pointer border-none"
                      >
                        Craft your first intent →
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {learningPaths.slice(0, 3).map((path, i) => (
                        <div
                          key={path.id}
                          className={noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]'}
                          style={noMotion ? {} : { animationDelay: `${0.25 + i * 0.08}s` }}
                        >
                          <LearningPathCard
                            path={path}
                            onContinue={() => navigate("/learn?pathId="+path.id)}
                            isDark={isDark}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Recommended Next Step */}
                <div className="lg:col-span-2">
                  <div className={noMotion ? 'opacity-100' : 'opacity-0 animate-[fadeUp_0.8s_ease-out_0.3s_forwards]'}>
                    <NextStepCard path={activePath} navigate={navigate} isDark={isDark} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default DashboardPage;


