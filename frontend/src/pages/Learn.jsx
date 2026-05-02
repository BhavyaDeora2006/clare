import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { fetchAllPaths, toggleTopic, updatePathProgress } from '../services/learningService';
import { usePreferences } from '../context/PreferencesContext';
import bgImage from "../assets/test-light-bg.png";

/* ═══════════════════════════════════════════════════════════
   KEYFRAME ANIMATIONS — injected via <style> tag
   (Tailwind has no built-in for these custom keyframes)
   ═══════════════════════════════════════════════════════════ */
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes celebrationScale {
      0%   { transform: scale(0.7); opacity: 0; }
      60%  { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes confettiBurst {
      0%   { transform: translateY(0) scale(1);   opacity: 1; }
      100% { transform: translateY(-50px) scale(0.5); opacity: 0; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0   rgba(76,175,125,0.3); }
      50%       { box-shadow: 0 0 0 8px rgba(76,175,125,0);   }
    }
    @keyframes checkDrop {
      0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
      60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg);   opacity: 1; }
    }
    @keyframes loadingPulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40%           { opacity: 1;   transform: scale(1);   }
    }

    .animate-fade-slide-up {
      animation: fadeSlideUp 0.6s ease-out forwards;
      opacity: 0;
    }
    .animate-celebration-scale {
      animation: celebrationScale 0.6s ease-out forwards;
    }
    .animate-confetti-burst {
      animation: confettiBurst 1s ease-out forwards;
    }
    .animate-check-drop {
      animation: checkDrop 0.5s ease-out 0.3s both;
    }
    .animate-loading-pulse {
      animation: loadingPulse 1.2s ease-in-out infinite;
    }
    .animate-loading-pulse-2 {
      animation: loadingPulse 1.2s ease-in-out 0.2s infinite;
    }
    .animate-loading-pulse-3 {
      animation: loadingPulse 1.2s ease-in-out 0.4s infinite;
    }

    /* Progress bar thumb dot — only shows on hover of parent */
    .player-progress-bar-inner:hover {
      height: 6px;
    }
    .player-progress-bar-inner:hover .progress-thumb::after {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
    .progress-thumb::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4caf7d;
      opacity: 0;
      transition: opacity 0.15s, transform 0.15s;
    }

    /* Left column custom scrollbar */
    .learn-col-left::-webkit-scrollbar        { width: 6px; }
    .learn-col-left::-webkit-scrollbar-track  { background: transparent; }
    .learn-col-left::-webkit-scrollbar-thumb  { background: #ddd; border-radius: 3px; }

    /* learn-main custom scrollbar */
    .learn-main-scroll::-webkit-scrollbar        { width: 6px; }
    .learn-main-scroll::-webkit-scrollbar-track  { background: transparent; }
    .learn-main-scroll::-webkit-scrollbar-thumb  { background: #ddd; border-radius: 3px; }

    /* Lesson hover translate — Tailwind has no translateX(2px) */
    .lesson-hover:hover:not(.lesson-locked-item) {
      background: #f7f7f4;
      transform: translateX(2px);
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   TRANSFORM BACKEND → LEARN UI FORMAT
   ═══════════════════════════════════════════════════════════ */
const transformPathToLearnData = (path) => {
  const { structure, content, current_topic_id, title, intent } = path;
  const chapters = (structure?.chapters || []).map(ch => ({
    id: ch.id,
    title: ch.title,
    lessons: (ch.topics || []).map(topic => {
      let status;
      if (topic.completed) status = 'completed';
      else if (topic.id === current_topic_id) status = 'in-progress';
      else status = 'locked';
      const tc = content?.[topic.id] || {};
      return {
        id: topic.id,
        title: topic.title || tc.title || 'Untitled',
        status,
        flow: tc.flow || [],
        example: tc.example || '',
        key_points: tc.key_points || [],
      };
    })
  }));
  let currentPosition = '';
  for (const ch of chapters) {
    const ip = ch.lessons.find(l => l.status === 'in-progress');
    if (ip) { currentPosition = `${ch.title} › ${ip.title}`; break; }
  }
  return {
    moduleName: title || 'Learning Path',
    moduleDescription: intent || '',
    currentPosition: currentPosition || 'All topics completed!',
    chapters,
  };
};

/* ═══════════════════════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════════════════════ */
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-[#e4e4e0] rounded ${className}`} />
);

const LearnSkeleton = () => (
  <div className="flex-1 flex gap-7 max-w-[1280px] w-full mx-auto px-9 py-7 items-start">
    <div className="flex-[0_0_42%] flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-[30px] py-7">
        <Shimmer className="h-4 w-32 mb-4" />
        <Shimmer className="h-6 w-48 mb-3" />
        <Shimmer className="h-3 w-64 mb-3" />
        <Shimmer className="h-3 w-40" />
      </div>
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-[30px] py-7">
        <div className="flex items-baseline justify-between mb-3">
          <Shimmer className="h-5 w-32" /><Shimmer className="h-4 w-20" />
        </div>
        <Shimmer className="h-[4px] w-full mb-7" />
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <Shimmer className="h-5 w-5 rounded-full" />
              <Shimmer className="h-4 w-40" />
            </div>
            <div className="pl-8 flex flex-col gap-2">
              <Shimmer className="h-8 w-full rounded-lg" />
              <Shimmer className="h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-7 pt-6"><Shimmer className="h-5 w-40 mb-2" /><Shimmer className="h-3 w-24" /></div>
        <div className="bg-[#fafaf8] mx-5 my-4 rounded-xl border border-[#eeede9] px-7 py-6 min-h-[200px] flex flex-col gap-3">
          <Shimmer className="h-4 w-full" /><Shimmer className="h-4 w-3/4" /><Shimmer className="h-4 w-5/6" />
        </div>
        <div className="px-7 pb-6 pt-4 flex items-center gap-4">
          <Shimmer className="h-9 w-9 rounded-full" /><Shimmer className="h-[4px] flex-1" /><Shimmer className="h-4 w-20" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] py-5 px-6">
        <Shimmer className="h-5 w-24 mb-4" />
        <Shimmer className="h-10 w-full rounded-lg mb-2" />
        <Shimmer className="h-10 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PATH SELECTOR — multiple learning paths
   ═══════════════════════════════════════════════════════════ */
const PathSelector = ({ paths, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = paths.find(p => p.id === selectedId);
  if (paths.length <= 1) return null;
  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-5 py-3 cursor-pointer border-none text-left transition-colors hover:bg-[#fafaf8]"
      >
        <div>
          <span className="text-[11px] text-[#aaa] uppercase tracking-[0.08em] font-medium">Active path</span>
          <p className="text-[14px] font-semibold text-[#1a1a1a] m-0 mt-0.5">{selected?.title || 'Select a path'}</p>
        </div>
        <svg className={`w-4 h-4 text-[#aaa] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#eee] z-20 overflow-hidden">
          {paths.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); setIsOpen(false); }}
              className={`w-full text-left px-5 py-3 border-none cursor-pointer transition-colors text-[13px] ${p.id === selectedId ? 'bg-[#eef8f2] text-[#2a7d52] font-medium' : 'bg-white text-[#555] hover:bg-[#fafaf8]'
                }`}
            >
              <p className="m-0 font-medium">{p.title}</p>
              <p className="m-0 text-[11px] text-[#aaa] mt-0.5">{p.progress}% complete</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SECONDS_PER_SENTENCE = 3;

/* ═══════════════════════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════════════════════ */
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M2.5 1.2v11.6L12.5 7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <rect x="2" y="1" width="3.5" height="12" rx="1" />
    <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const VolumeMuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-11.25 5.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   STATUS ICONS
   ═══════════════════════════════════════════════════════════ */
const StatusDot = ({ status, size = 18 }) => {
  if (status === 'completed') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#4caf7d" />
        <path d="M6 10.5l2.5 2.5L14 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'in-progress') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#4caf7d" strokeWidth="2" />
        <circle cx="10" cy="10" r="4" fill="#4caf7d" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#ccc" strokeWidth="1.5" />
    </svg>
  );
};

const ChapterStatusIcon = ({ lessons }) => {
  const all = lessons.every(l => l.status === 'completed');
  const some = lessons.some(l => l.status === 'completed' || l.status === 'in-progress');
  if (all) return <StatusDot status="completed" size={22} />;
  if (some) return <StatusDot status="in-progress" size={22} />;
  return <StatusDot status="locked" size={22} />;
};

/* ═══════════════════════════════════════════════════════════
   CURRENT MODULE CARD
   ═══════════════════════════════════════════════════════════ */
const CurrentModuleCard = ({ moduleName, moduleDescription, currentPosition, isDark }) => (
  /* learn-card */
  <div className={`rounded-2xl px-[30px] py-7
    ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
    shadow-[0_20px_60px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]`}>
    {/* module-card-header */}
    <div className={`text-[18px] font-light mb-4 tracking-[0.01em] ${isDark ? 'text-[#a8a29e]' : 'text-[#888]'}`}>
      Current <strong className={`font-semibold ${isDark ? 'text-stone-200' : 'text-[#333]'}`}>Module</strong>
    </div>
    {/* module-card-title */}
    <div className={`text-[22px] font-bold mb-2 tracking-[-0.01em] ${isDark ? 'text-stone-200' : 'text-[#1a1a1a]'}`}>
      {moduleName}
    </div>
    {/* module-card-desc */}
    <div className={`text-[14px] mb-[14px] leading-[1.5] ${isDark ? 'text-[#a8a29e]' : 'text-[#888]'}`}>
      {moduleDescription}
    </div>
    {/* module-card-position */}
    <div className={`text-[13px] leading-[1.5] ${isDark ? 'text-[#78716c]' : 'text-[#aaa]'}`}>
      <strong className={`font-medium ${isDark ? 'text-[#a8a29e]' : 'text-[#999]'}`}>You are here:</strong> {currentPosition}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   LEARNING PATH
   ═══════════════════════════════════════════════════════════ */
const LearningPath = ({ chapters, progress, activeLessonId, onLessonClick ,isDark}) => (
  /* wrapped in learn-card */
  <div className={`rounded-2xl px-[30px] py-7
    ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
    shadow-[0_20px_60px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]`}>
    {/* path-header */}
    <div className="flex items-baseline justify-between mb-3">
      {/* path-title */}
      <span className={`text-[20px] font-semibold tracking-[-0.01em] ${isDark ? 'text-stone-200' : 'text-[#1a1a1a]'}`}>Learning Path</span>
      {/* path-percent */}
      <span className={`text-[14px] font-normal ${isDark ? 'text-[#a8a29e]' : 'text-[#888]'}`}>{progress}% complete</span>
    </div>

    {/* path-progress-bar */}
    <div className={`w-full h-[4px] rounded mb-7 overflow-hidden ${isDark ? 'bg-[#44403c]' : 'bg-[#e8e8e4]'}`}>
      {/* path-progress-fill */}
      <div
        className="h-full rounded transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c8c6e 0%, #8a9a7b 50%, #a3b18a 100%)',}}
      />
    </div>

    {chapters.map((ch) => (
      /* chapter-block */
      <div key={ch.id} className="mb-6">
        {/* chapter-header */}
        <div className="flex items-center justify-between mb-3">
          {/* chapter-header-left */}
          <div className="flex items-center gap-[10px]">
            {/* chapter-status-icon */}
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <ChapterStatusIcon lessons={ch.lessons} />
            </div>
            {/* chapter-title */}
            <span className="text-[15px] font-semibold text-[#1a1a1a]">{ch.title}</span>
          </div>
          {/* chapter-menu */}
          <button
            className="bg-transparent border-none text-[#bbb] text-[18px] cursor-pointer py-1 px-2 rounded-md tracking-[2px] transition-colors duration-200 hover:text-[#888] hover:bg-[#f5f5f2]"
            aria-label="Chapter menu"
          >
            •••
          </button>
        </div>

        {/* lesson-list */}
        <div className="pl-8 flex flex-col gap-[6px]">
          {ch.lessons.map((lesson) => {
            const isActive = lesson.id === activeLessonId;
            const isLocked = lesson.status === 'locked';
            return (
              <div
                key={lesson.id}
                className={[
                  // lesson-item base
                  'flex items-center gap-[10px] py-[7px] px-3 rounded-[10px] relative transition-[background,transform] duration-[200ms,150ms]',
                  // active
                  isActive ? 'bg-[#eef8f2]' : '',
                  // locked
                  isLocked ? 'cursor-default opacity-55 lesson-locked-item' : 'cursor-pointer lesson-hover',
                ].join(' ')}
                onClick={() => !isLocked && onLessonClick(lesson)}
              >
                {/* lesson-status-dot */}
                <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                  <StatusDot status={lesson.status} />
                </div>
                {/* lesson-title */}
                <span
                  className={[
                    'text-[14px]',
                    isActive
                      ? 'font-medium text-[#2a7d52]'   // lesson-active .lesson-title
                      : 'font-normal text-[#444]',
                  ].join(' ')}
                >
                  {lesson.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   COMPLETION OVERLAY
   ═══════════════════════════════════════════════════════════ */
const CONFETTI_COLORS = ['#4caf7d', '#81c784', '#a5d6a7', '#66bb6a', '#43a047', '#e8f5e9', '#b9f6ca'];

const CompletionOverlay = ({ onNext, hasNext }) => {
  const confettiPieces = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${10 + Math.random() * 80}%`,
    top: `${20 + Math.random() * 40}%`,
    delay: `${Math.random() * 0.5}s`,
    size: 6 + Math.random() * 6,
  }));

  return (
    /* completion-overlay */
    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 rounded-xl animate-celebration-scale">
      {confettiPieces.map(p => (
        /* confetti-piece */
        <div
          key={p.id}
          className="absolute rounded-full animate-confetti-burst"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
      {/* completion-check */}
      <div className="text-[48px] mb-3 animate-check-drop">✅</div>
      {/* completion-text */}
      <div className="text-[18px] font-semibold text-[#2a7d52] mb-1">Topic Complete!</div>
      {/* completion-sub */}
      <div className="text-[13px] text-[#aaa]">
        {hasNext ? 'Moving to next lesson…' : 'You finished this module!'}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LESSON PLAYER
   ═══════════════════════════════════════════════════════════ */
const LessonPlayer = ({ lesson, onComplete, chapters, onProgressUpdate }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef(null);
  const playerRef = useRef(null);
  const uttRef = useRef(null);
  const fallbackRef = useRef(null);
  const isMutedRef = useRef(false);

  const slides = lesson ? chunkArray(lesson.flow, 3) : [];
  const totalSentences = lesson ? lesson.flow.length : 0;
  const globalIdx = slideIdx * 3 + visibleCount;
  const progressPct = totalSentences > 0 ? (globalIdx / totalSentences) * 100 : 0;
  const currentTime = globalIdx * SECONDS_PER_SENTENCE;
  const totalTime = totalSentences * SECONDS_PER_SENTENCE;
  const currentSlide = slides[slideIdx] || [];
  const currentSentence = currentSlide[visibleCount - 1] || '';

  const hasNext = (() => {
    if (!lesson || !chapters) return false;
    const flat = chapters.flatMap(ch => ch.lessons);
    const idx = flat.findIndex(l => l.id === lesson.id);
    return idx >= 0 && idx < flat.length - 1;
  })();

  useEffect(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
    window.speechSynthesis.getVoices();
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
    return () => {
      clearInterval(keepAlive);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (onProgressUpdate) onProgressUpdate({ globalIdx, currentSentence });
  }, [globalIdx, currentSentence]); // eslint-disable-line react-hooks/exhaustive-deps

  const speakSentence = (text, onDone) => {
    if (!window.speechSynthesis || !text) { onDone(); return; }
    window.speechSynthesis.cancel();
    uttRef.current = null;
    clearTimeout(fallbackRef.current);
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedMs = Math.max(2500, wordCount * 150 + 800);
    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
      uttRef.current = null;
      onDone();
    };
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0; utt.pitch = 1.0; utt.volume = 1.0;
    utt.onend = finish;
    utt.onerror = (e) => { console.warn('[TTS] onerror:', e.error); finish(); };
    uttRef.current = utt;
    fallbackRef.current = setTimeout(finish, estimatedMs);
    window.speechSynthesis.speak(utt);
  };

  const cancelSpeech = () => {
    clearTimeout(fallbackRef.current);
    fallbackRef.current = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    uttRef.current = null;
  };

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    cancelSpeech();
    setSlideIdx(0); setVisibleCount(0); setIsPlaying(false); setIsComplete(false);
    return () => { clearTimeout(timerRef.current); cancelSpeech(); };
  }, [lesson?.id]);

  useEffect(() => {
    if (!lesson || !isPlaying || isComplete) return;
    const currentSlides = chunkArray(lesson.flow, 3);
    const slide = currentSlides[slideIdx];
    if (!slide) return;
    let cancelled = false;

    const advance = () => {
      if (cancelled) return;
      if (visibleCount < slide.length) {
        timerRef.current = setTimeout(() => { if (!cancelled) setVisibleCount(v => v + 1); }, 1200);
      } else if (slideIdx < currentSlides.length - 1) {
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setSlideIdx(s => s + 1); setVisibleCount(0);
        }, 1000);
      } else {
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          setIsComplete(true); setIsPlaying(false);
          if (onComplete) onComplete(lesson.id);
        }, 1000);
      }
    };

    if (visibleCount === 0) {
      timerRef.current = setTimeout(() => { if (!cancelled) setVisibleCount(1); }, 400);
    } else if (visibleCount <= slide.length) {
      const sentence = slide[visibleCount - 1];
      if (isMutedRef.current || !window.speechSynthesis || !sentence) {
        timerRef.current = setTimeout(() => { if (!cancelled) advance(); }, 1500);
      } else {
        timerRef.current = setTimeout(() => {
          if (cancelled) return;
          speakSentence(sentence, () => { if (!cancelled) advance(); });
        }, 0);
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [slideIdx, visibleCount, isPlaying, isComplete, lesson?.id, onComplete]);

  const togglePlay = () => {
    if (isComplete) return;
    if (isPlaying) {
      clearTimeout(timerRef.current); timerRef.current = null;
      cancelSpeech(); setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    if (next) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
      uttRef.current = null;
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const seekToGlobalIdx = (targetIdx) => {
    if (!lesson) return;
    const clamped = Math.max(1, Math.min(targetIdx, totalSentences));
    const newSlideIdx = Math.floor((clamped - 1) / 3);
    const newVisibleCount = clamped - newSlideIdx * 3;
    const clampedSlide = Math.min(newSlideIdx, slides.length - 1);
    const slideLen = slides[clampedSlide]?.length || 0;
    const clampedVc = Math.min(newVisibleCount, slideLen);
    setSlideIdx(clampedSlide); setVisibleCount(clampedVc);
    setIsComplete(false); setIsPlaying(true);
  };

  const handleSeek = (e) => {
    if (!lesson || isComplete) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetIdx = Math.max(1, Math.min(Math.round(pct * totalSentences), totalSentences));
    seekToGlobalIdx(targetIdx);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!lesson) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': e.preventDefault(); seekToGlobalIdx(globalIdx + 1); break;
        case 'ArrowLeft': e.preventDefault(); seekToGlobalIdx(Math.max(1, globalIdx - 1)); break;
        case 'KeyM': e.preventDefault(); toggleMute(); break;
        case 'KeyF': e.preventDefault(); toggleFullscreen(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lesson, isPlaying, isComplete, globalIdx, isMuted]);

  if (!lesson) {
    return (
      /* learn-card player-card (empty state) */
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* player-empty */}
        <div className="flex flex-col items-center justify-center min-h-[280px] text-[#bbb] text-[14px] gap-3">
          {/* player-empty-icon */}
          <div className="text-[40px] opacity-40">📖</div>
          <span>Select a lesson to begin learning</span>
        </div>
      </div>
    );
  }

  /* ── Fullscreen vs normal wrapper classes ─────────────── */
  const cardCls = isFullscreen
    ? // player-fullscreen
    'bg-white rounded-none shadow-none flex flex-col justify-center h-screen w-screen'
    : // learn-card player-card
    'bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.06)] overflow-hidden';

  return (
    <div className={`${cardCls} relative`} ref={playerRef}>

      {/* player-header-row */}
      <div className={`flex items-baseline justify-between ${isFullscreen ? 'px-[60px] pt-10' : 'px-7 pt-[22px]'}`}>
        {/* player-header */}
        <div className={`font-semibold text-[#1a1a1a] tracking-[-0.01em] ${isFullscreen ? 'text-[24px]' : 'text-[17px]'}`}>
          {lesson.title}
        </div>
        {/* player-header-right */}
        <div className="flex items-center gap-[10px]">
          {/* player-muted-badge */}
          {isMuted && (
            <span className="text-[10px] text-[#e57373] bg-[#fbe9e7] py-[2px] px-2 rounded-[10px] font-medium tracking-[0.02em]">
              Muted
            </span>
          )}
          {/* player-slide-indicator */}
          {slides.length > 1 && !isComplete && (
            <span className={`text-[#bbb] font-normal ${isFullscreen ? 'text-[14px]' : 'text-[12px]'}`}>
              Slide {slideIdx + 1} of {slides.length}
            </span>
          )}
        </div>
      </div>

      {/* player-stage */}
      <div
        className={[
          'flex flex-col justify-center relative',
          isFullscreen
            ? 'bg-[#f8f8f6] border border-[#eee] mx-[60px] my-6 min-h-[340px] flex-1 px-12 py-10'
            : 'bg-[#fafaf8] mx-5 my-4 rounded-xl border border-[#eeede9] px-7 py-6 min-h-[200px]',
        ].join(' ')}
      >
        {isComplete && <CompletionOverlay hasNext={hasNext} />}

        {!isComplete && currentSlide.map((sentence, i) =>
          i < visibleCount ? (
            <div
              key={`${slideIdx}-${i}`}
              className={[
                'animate-fade-slide-up mb-3 last:mb-0 [animation-delay:0s]',
                isFullscreen
                  ? 'text-[22px] text-[#2a2a2a] leading-[2]'
                  : 'text-[15px] text-[#3a3a3a] leading-[1.75]',
              ].join(' ')}
            >
              {sentence}
            </div>
          ) : null
        )}

        {!isComplete && visibleCount === 0 && (
          /* player-waiting-msg */
          <div className={`flex items-center justify-center gap-[6px] min-h-[60px] ${isFullscreen ? 'text-[#bbb] text-[16px]' : 'text-[#ccc] text-[14px]'}`}>
            {isPlaying ? (
              <>
                {/* player-loading-dot × 3 */}
                <div className={`rounded-full bg-[#4caf7d] animate-loading-pulse ${isFullscreen ? 'w-[10px] h-[10px]' : 'w-2 h-2'}`} />
                <div className={`rounded-full bg-[#4caf7d] animate-loading-pulse-2 ${isFullscreen ? 'w-[10px] h-[10px]' : 'w-2 h-2'}`} />
                <div className={`rounded-full bg-[#4caf7d] animate-loading-pulse-3 ${isFullscreen ? 'w-[10px] h-[10px]' : 'w-2 h-2'}`} />
              </>
            ) : (
              /* player-start-hint */
              <span className="text-[#4caf7d] text-[14px] font-medium tracking-[0.01em]">
                ▶ Click play to start
              </span>
            )}
          </div>
        )}
      </div>

      {/* player-controls */}
      <div className={`flex items-center gap-[14px] ${isFullscreen ? 'px-[60px] pb-7 pt-5' : 'px-7 pb-[22px] pt-[14px]'}`}>

        {/* player-play-btn */}
        <button
          className={`rounded-full border-none bg-[#1a1a1a] text-white flex items-center justify-center shrink-0 cursor-pointer transition-[background,transform] duration-[200ms,150ms] hover:bg-[#333] hover:scale-105 active:scale-95 ${isFullscreen ? 'w-12 h-12' : 'w-9 h-9'}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* player-progress-wrap */}
        <div className="flex-1 flex items-center gap-3">
          {/* player-progress-bar */}
          <div
            className="player-progress-bar-inner flex-1 h-[4px] bg-[#e4e4e0] rounded overflow-visible relative cursor-pointer transition-[height] duration-150 ease-in-out"
            onClick={handleSeek}
          >
            {/* player-progress-fill */}
            <div
              className="progress-thumb h-full bg-[#4caf7d] rounded transition-[width] duration-[400ms] ease-in-out relative"
              style={{ width: `${isComplete ? 100 : progressPct}%` }}
            />
          </div>

          {/* player-timestamp */}
          <span className={`text-[#aaa] font-[tabular-nums] whitespace-nowrap min-w-[80px] ${isFullscreen ? 'text-[14px]' : 'text-[12px]'}`}>
            {formatTime(isComplete ? totalTime : currentTime)} / {formatTime(totalTime)}
          </span>
        </div>

        {/* player-volume-btn */}
        <button
          className={`bg-transparent border-none cursor-pointer p-1 flex items-center transition-colors duration-200 ${isMuted ? 'text-[#4caf7d]' : 'text-[#bbb] hover:text-[#666]'}`}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
        >
          {isMuted ? <VolumeMuteIcon /> : <VolumeIcon />}
        </button>

        {/* player-fullscreen-btn */}
        <button
          className={`bg-transparent border-none cursor-pointer p-1 flex items-center transition-colors duration-200 ${isFullscreen ? 'text-[#4caf7d]' : 'text-[#bbb] hover:text-[#666]'}`}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
        >
          {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TAKE NOTES
   ═══════════════════════════════════════════════════════════ */
const TakeNotes = ({ flow, globalIdx, currentSentence,isDark }) => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');
  const prevFlowRef = useRef(null);
  const prevSlideRef = useRef(-1);

  useEffect(() => {
    if (!flow || flow.length === 0) return;
    if (prevFlowRef.current === flow) return;
    prevFlowRef.current = flow;
    prevSlideRef.current = -1;
    const slides = chunkArray(flow, 3);
    const seed = slides[0]?.[0];
    setNotes(seed ? [{ text: seed, auto: true, ts: Date.now() }] : []);
  }, [flow]);

  useEffect(() => {
    if (!flow || flow.length === 0 || globalIdx === 0) return;
    const slideNum = Math.floor(globalIdx / 3);
    if (globalIdx % 3 !== 0) return;
    if (slideNum === prevSlideRef.current) return;
    prevSlideRef.current = slideNum;
    const slides = chunkArray(flow, 3);
    const sentence = slides[slideNum]?.[0];
    if (!sentence) return;
    setNotes(prev => [...prev, { text: sentence, auto: true, ts: Date.now() }]);
  }, [globalIdx, flow]);

  const addNote = () => {
    const text = input.trim();
    if (!text) return;
    setNotes(prev => [...prev, { text, auto: false, ts: Date.now() }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNote();
  };

  const now = Date.now();

  return (
    /* notes-card  (learn-card with tighter padding) */
    <div className={`rounded-2xl py-5 px-6
      ${isDark ? 'bg-[#292524]/60 border-[#44403c]/30' : 'bg-white/45 border-[#d6d3d1]/40'}
      shadow-[0_20px_60px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]`}>

      {/* notes-header */}
      <div className="flex items-center justify-between mb-[14px]">
        {/* notes-title */}
        <span className={`text-[16px] font-semibold ${isDark ? 'text-stone-200' : 'text-[#1a1a1a]'}`}>Take Notes</span>
        <button
          className={`bg-transparent border-none text-[18px] cursor-pointer py-1 px-2 rounded-md tracking-[2px] transition-colors duration-200
          ${isDark ? 'text-[#78716c] hover:text-[#a8a29e] hover:bg-[#44403c]/40' : 'text-[#bbb] hover:text-[#888] hover:bg-[#f5f5f2]'}`}
          aria-label="Notes menu"
        >
          •••
        </button>
      </div>

      {notes.map((note, i) => (
        /* note-item */
        <div
          key={i}
          className={`flex items-center justify-between py-[14px] px-4 rounded-[10px] mb-2 transition-colors duration-200
            ${isDark ? 'bg-[#44403c]/30 hover:bg-[#44403c]/50' : 'bg-[#fafaf8] hover:bg-[#f2f2ee]'}`}
        >
          {/* note-text  — replicates ::before via inline span */}
          <span className={`text-[13.5px] leading-[1.5] flex-1 ${isDark ? 'text-[#a8a29e]' : 'text-[#555]'}`}>
            <span className={`mr-2 font-bold ${isDark ? 'text-[#78716c]' : 'text-[#ccc]'}`}>{note.auto ? '·' : '+'}</span>
            {note.text}
          </span>

          {(now - note.ts) < 3000 && (
            <span className="text-[10px] text-[#4caf7d] bg-[#eef8f2] px-2 py-[2px] rounded-full font-semibold mr-2">
              NEW
            </span>
          )}

          {/* note-link-btn */}
          <button
            className={`bg-transparent border-none cursor-pointer p-1 shrink-0 flex items-center transition-colors duration-200
            ${isDark ? 'text-[#78716c] hover:text-[#a8a29e]' : 'text-[#ccc] hover:text-[#888]'}`}
            aria-label="Open externally"
          >
            <ExternalLinkIcon />
          </button>
        </div>
      ))}

      {/* note-add-wrap */}
      <div className="flex items-center gap-2 pt-[6px]">
        {/* note-add-plus */}
        <span className={`text-[14px] font-light ${isDark ? 'text-[#78716c]' : 'text-[#ccc]'}`}>+</span>
        {/* note-add-input */}
        <input
          className={`flex-1 border-none bg-transparent text-[13.5px] outline-none font-[inherit]
            ${isDark ? 'text-[#a8a29e] placeholder-[#78716c]' : 'text-[#888] placeholder-[#ccc]'}`}
          placeholder="Add a new note..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LEARN PAGE — MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const Learn = () => {
  const { prefs } = usePreferences();
  const isDark = prefs.theme === 'dark';
  const navigate = useNavigate();

  /* ── Fetch state ── */
  const [paths, setPaths] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Lesson state ── */
  const [data, setData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [playerProgress, setPlayerProgress] = useState({ globalIdx: 0, currentSentence: '' });
  const [rawPath, setRawPath] = useState(null);

  /* ── Fetch all paths on mount ── */
  const loadPaths = async () => {
    try {
      setLoading(true);
      setError(null);
      const allPaths = await fetchAllPaths();
      setPaths(allPaths);
      if (allPaths.length > 0 && !selectedPathId) {
        const active = allPaths.find(p => p.progress < 100) || allPaths[0];
        setSelectedPathId(active.id);
      }
    } catch (err) {
      console.error('Failed to load paths:', err);
      setError('Could not load your learning paths. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPaths(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── When selectedPathId changes, transform and set data ── */
  useEffect(() => {
    if (!selectedPathId || paths.length === 0) return;
    const path = paths.find(p => p.id === selectedPathId);
    if (!path) return;

    setRawPath(path);
    const transformed = transformPathToLearnData(path);
    setData(transformed);
    const cloned = JSON.parse(JSON.stringify(transformed.chapters));
    setChapters(cloned);

    const allL = cloned.flatMap(ch => ch.lessons);
    const ip = allL.find(l => l.status === 'in-progress');
    const first = allL.find(l => l.status !== 'locked');
    setActiveLesson(ip || first || null);
    setPlayerProgress({ globalIdx: 0, currentSentence: '' });
  }, [selectedPathId, paths]);

  /* ── Derived values ── */
  const allLessons = chapters.flatMap(ch => ch.lessons);
  const completedCount = allLessons.filter(l => l.status === 'completed').length;
  const progress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const liveActiveLesson = activeLesson
    ? allLessons.find(l => l.id === activeLesson.id) || activeLesson
    : null;

  /* ── Handle lesson completion ── */
  const handleLessonComplete = async (lessonId) => {
    const flat = chapters.flatMap(ch => ch.lessons);
    const idx = flat.findIndex(l => l.id === lessonId);
    const nextLesson = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

    // Optimistic local update
    setChapters(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      for (const ch of updated)
        for (const l of ch.lessons)
          if (l.id === lessonId) l.status = 'completed';
      if (nextLesson) {
        for (const ch of updated)
          for (const l of ch.lessons)
            if (l.id === nextLesson.id && l.status === 'locked')
              l.status = 'in-progress';
      }
      return updated;
    });

    // Backend sync
    if (rawPath) {
      try {
        await toggleTopic(rawPath.id, lessonId);
        if (nextLesson) {
          let nextChId = null;
          for (const ch of rawPath.structure?.chapters || []) {
            if ((ch.topics || []).some(t => t.id === nextLesson.id)) {
              nextChId = ch.id; break;
            }
          }
          if (nextChId) await updatePathProgress(rawPath.id, nextLesson.id, nextChId);
        }
        // Silently refresh path list
        const fresh = await fetchAllPaths();
        setPaths(fresh);
      } catch (err) {
        console.error('Failed to sync progress:', err);
      }
    }

    // Navigate to next after completion animation
    setTimeout(() => {
      if (nextLesson) setActiveLesson(nextLesson);
    }, 2500);
  };

  /* ── Render ── */
  return (
    <div
      className="min-h-screen flex flex-col font-['Inter',system-ui,-apple-system,sans-serif]"
    >
      <AnimationStyles />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-colors duration-500"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(28,25,23,0.88), rgba(28,25,23,0.88)), url(${bgImage})`
            : `url(${bgImage})`,
        }}
      />
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/40' : 'bg-gradient-to-br from-white/20 via-transparent to-black/5'}`} />
      <Navbar />

      {/* Loading */}
      {loading && <div className="relative z-10"><LearnSkeleton /></div>}

      {/* Error */}
      {!loading && error && (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center max-w-md">
            <div className="text-[48px] mb-4">⚠️</div>
            <h2 className="text-[22px] font-semibold text-[#1a1a1a] mb-2">Something went wrong</h2>
            <p className="text-[14px] text-[#888] leading-relaxed mb-6">{error}</p>
            <button
              onClick={loadPaths}
              className="px-6 py-3 rounded-xl text-[14px] font-medium text-white bg-[#1a1a1a] border-none cursor-pointer transition-all hover:bg-[#333]"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty — no paths */}
      {!loading && !error && paths.length === 0 && (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center max-w-md">
            <div className="text-[48px] mb-4">📖</div>
            <h2 className="text-[22px] font-semibold text-[#1a1a1a] mb-2">No learning paths yet</h2>
            <p className="text-[14px] text-[#888] leading-relaxed mb-6">
              Start by crafting a study intent. CLARE will generate a personalized learning path for you.
            </p>
            <button
              onClick={() => navigate('/craft')}
              className="px-6 py-3 rounded-xl text-[14px] font-medium text-white bg-[#1a1a1a] border-none cursor-pointer transition-all hover:bg-[#333] hover:scale-[1.02] active:scale-100"
            >
              Craft your first intent →
            </button>
          </div>
        </div>
      )}

      {/* Main content — data loaded */}
      {!loading && !error && data && (
        <div className="learn-main-scroll flex-1 flex gap-7 max-w-[1280px] w-full mx-auto px-9 py-7 overflow-y-auto items-start relative z-10">

          {/* learn-col-left */}
          <div className="learn-col-left flex-[0_0_42%] flex flex-col gap-6 max-h-[calc(100vh-100px)] overflow-y-auto">
            <PathSelector paths={paths} selectedId={selectedPathId} onSelect={setSelectedPathId} isDark={isDark}/>
            <CurrentModuleCard
              moduleName={data.moduleName}
              moduleDescription={data.moduleDescription}
              currentPosition={data.currentPosition}
              isDark={isDark}
            />
            <LearningPath
              chapters={chapters}
              progress={progress}
              activeLessonId={liveActiveLesson?.id}
              onLessonClick={lesson => setActiveLesson(lesson)}
              isDark={isDark}
            />
          </div>

          {/* learn-col-right */}
          <div className="flex-1 flex flex-col gap-5">
            <LessonPlayer
              lesson={liveActiveLesson}
              onComplete={handleLessonComplete}
              chapters={chapters}
              onProgressUpdate={setPlayerProgress}
            />
            <TakeNotes
              flow={liveActiveLesson?.flow || []}
              globalIdx={playerProgress.globalIdx}
              currentSentence={playerProgress.currentSentence}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;