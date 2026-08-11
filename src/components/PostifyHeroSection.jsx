import React, { useState, useEffect } from "react";
import { X, Sparkles, Pause } from "lucide-react";
import PostifyHeaderBanner from "./PostifyHeaderBanner.jsx";

const DURATION_SECONDS = 15;

export const PostifyHeroSection = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem("postify_hide_hero") !== "true";
  });
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [isPaused, setIsPaused] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // If timer is paused while holding press, stop countdown
    if (isPaused) return;

    if (timeLeft <= 0) {
      handleDismiss();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, timeLeft]);

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem("postify_hide_hero", "true");
      setIsVisible(false);
    }, 350);
  };

  if (!isVisible) return null;

  const progressPercent = (timeLeft / DURATION_SECONDS) * 100;

  return (
    <div
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      title="Hold click to pause timer"
      className={`mb-8 relative overflow-hidden bg-gradient-to-r from-slate-100/95 via-white to-slate-100/90 dark:from-[#0D1424] dark:via-[#111A2E] dark:to-[#0A0F1D] border border-slate-200/80 dark:border-[#1C2A4A] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-all duration-300 select-none cursor-pointer ${
        isFadingOut ? "opacity-0 scale-95 max-h-0 py-0 mb-0 border-none overflow-hidden" : "opacity-100 scale-100"
      }`}
    >
      {/* Auto-dismiss timer progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-[#1C2A4A] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 ${
            isPaused ? "opacity-40" : "transition-all duration-1000 ease-linear"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Close button top-right */}
      <button
        onClick={handleDismiss}
        onMouseDown={(e) => e.stopPropagation()}
        title="Dismiss banner"
        className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#1C2A4A] transition cursor-pointer z-20"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Hero Content Left */}
      <div className="flex-1 text-center md:text-left z-10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Welcome to Postify
          </span>

          {/* Timer pill badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
              isPaused
                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                : "bg-slate-100 dark:bg-[#141D33] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#1C2A4A]"
            }`}
          >
            {isPaused ? (
              <>
                <Pause className="w-3 h-3 text-amber-500 animate-pulse" /> Paused ({timeLeft}s)
              </>
            ) : (
              <>⏱️ Auto-closes in {timeLeft}s</>
            )}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Community Driven Publishing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          Create, read, and share inspiring stories with an open community of passionate creators.
        </p>
      </div>

      {/* Header SVG Graphic Right */}
      <div className="w-full md:w-80 shrink-0 z-10 flex justify-center">
        <PostifyHeaderBanner className="max-w-[280px] sm:max-w-xs" />
      </div>
    </div>
  );
};

export default PostifyHeroSection;
