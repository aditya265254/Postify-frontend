import React from "react";

/**
 * PostifyLogo Component
 * Recreates the Postify paper plane brand logo from the design image.
 * 
 * Props:
 * - variant: "full" (Icon + Text + Tagline), "navbar" (Icon + Text), or "icon" (Icon only)
 * - className: additional wrapper styling
 */
export const PostifyLogo = ({ variant = "navbar", className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Paper Plane Icon Badge */}
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoPlaneGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="35%" stopColor="#6366F1" />
            <stop offset="70%" stopColor="#A855F7" />
            <stop offset="88%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="logoShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id="logoLayersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366F1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Circular Background Disk */}
        <circle cx="50" cy="50" r="46" className="fill-slate-100 dark:fill-[#0F172A] stroke-slate-200 dark:stroke-[#1E293B]" strokeWidth="2" />

        {/* Stacked Layers at bottom */}
        <g transform="translate(38, 70) scale(0.6)">
          <path d="M -16 12 L 0 5 L 16 12 L 0 19 Z" fill="#F0FDFA" stroke="url(#logoLayersGrad)" strokeWidth="3" strokeLinejoin="round" />
          <path d="M -16 6 L 0 -1 L 16 6 L 0 13 Z" fill="#CCFBF1" stroke="url(#logoLayersGrad)" strokeWidth="3" strokeLinejoin="round" />
          <path d="M -16 0 L 0 -7 L 16 0 L 0 7 Z" fill="#99F6E4" stroke="url(#logoLayersGrad)" strokeWidth="3" strokeLinejoin="round" />
        </g>

        {/* Paper Plane Flying */}
        <g transform="translate(5, -2)" filter="url(#logoGlow)">
          <path d="M 22 48 L 76 22 L 36 74 Z" fill="url(#logoShadowGrad)" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 76 22 L 36 74 L 46 64 Z" fill="#9333EA" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 22 48 L 76 22 L 36 74 Z" fill="url(#logoPlaneGrad)" stroke="#0F172A" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 22 48 L 76 22" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 22 48 L 76 22 L 36 74 Z" fill="none" stroke="#FDE68A" strokeWidth="1" opacity="0.8" />
        </g>
      </svg>

      {/* Brand Text Header */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight text-2xl font-black font-sans leading-none text-slate-800 dark:text-white">
            <span>P</span>
            {/* Embedded Paper Plane inside 'o' */}
            <span className="relative inline-flex items-center justify-center w-6 h-6 mx-[1px] shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle cx="20" cy="20" r="16" className="fill-white dark:fill-[#0F172A] stroke-slate-800 dark:stroke-slate-200" strokeWidth="4" />
                <path d="M 10 27 L 30 11 L 21 29 L 16 21 Z" fill="url(#logoPlaneGrad)" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
            <span>stify</span>
          </div>
          {variant === "full" && (
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 uppercase">
              Community Driven Publishing
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostifyLogo;
