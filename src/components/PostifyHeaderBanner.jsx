import React from "react";

/**
 * PostifyHeaderBanner Component
 * Full SVG header graphic representing the user's Postify artwork image.
 * Features:
 * - Soft circular backdrop glow ring
 * - "Postify" branding with paper plane inside the 'o'
 * - "Community Driven Publishing" tagline
 * - Big multi-gradient flying paper plane
 * - 3D stacked card layers at launch origin
 */
export const PostifyHeaderBanner = ({ className = "" }) => {
  return (
    <div className={`relative w-full max-w-2xl mx-auto overflow-hidden p-4 rounded-3xl transition-colors ${className}`}>
      <svg
        viewBox="0 0 700 520"
        className="w-full h-auto drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Glow Radius Gradient */}
          <radialGradient id="headerBgGlow" cx="50%" cy="48%" r="48%">
            <stop offset="0%" stopColor="#FFFFFF" className="[html.dark_&]:[stop-color:#0F172A]" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#F8FAFC" className="[html.dark_&]:[stop-color:#0B1120]" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E2E8F0" className="[html.dark_&]:[stop-color:#070C18]" stopOpacity="0.3" />
          </radialGradient>

          {/* Main Paper Plane Gradient */}
          <linearGradient id="headerPlaneMain" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="28%" stopColor="#6366F1" />
            <stop offset="60%" stopColor="#A855F7" />
            <stop offset="82%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Shadow Fold Gradient */}
          <linearGradient id="headerPlaneShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="50%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Right Wing Fold Gradient */}
          <linearGradient id="headerPlaneRight" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#6B21A8" />
            <stop offset="60%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>

          {/* 'o' Paper Plane Gradient */}
          <linearGradient id="headerOGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          {/* Stacked Layers Gradient */}
          <linearGradient id="headerLayersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="headerPlaneFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="10" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Large Soft Outer Circle Backdrop */}
        <circle
          cx="350"
          cy="260"
          r="230"
          fill="url(#headerBgGlow)"
          className="stroke-slate-200/80 dark:stroke-[#1E293B]"
          strokeWidth="1.5"
        />

        {/* HEADER BRANDING TEXT */}
        <g id="brandHeading" transform="translate(350, 135)">
          {/* Letter P */}
          <text
            x="-148"
            y="0"
            className="fill-slate-800 dark:fill-white font-sans font-black text-6xl tracking-tight"
          >
            P
          </text>

          {/* 'o' with embedded Paper Plane */}
          <g transform="translate(-78, -21)">
            {/* Outer circle ring */}
            <circle
              cx="0"
              cy="0"
              r="25"
              className="fill-white dark:fill-[#0F172A] stroke-slate-800 dark:stroke-slate-200"
              strokeWidth="6.5"
            />
            {/* Paper plane in o */}
            <g transform="translate(0, 1) scale(0.95)">
              <path
                d="M -13 9 L 14 -12 L 3 13 L -3 3 Z"
                fill="url(#headerOGrad)"
                stroke="#1E293B"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M 14 -12 L -3 3 L -3 13 Z" fill="#312E81" opacity="0.6" />
              <path d="M -3 3 L 3 13" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
            </g>
          </g>

          {/* Letters stify */}
          <text
            x="-44"
            y="0"
            className="fill-slate-800 dark:fill-white font-sans font-black text-6xl tracking-tight"
          >
            stify
          </text>

          {/* Tagline: Community Driven Publishing */}
          <text
            x="0"
            y="42"
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 font-sans font-semibold text-lg tracking-widest"
          >
            Community Driven Publishing
          </text>
        </g>

        {/* MAIN FLYING PAPER PLANE GRAPHIC */}
        <g id="mainPaperPlane" filter="url(#headerPlaneFilter)">
          {/* Stacked Layers Icon at base */}
          <g id="stackedLayers" transform="translate(290, 400)">
            <path
              d="M -26 24 L 0 11 L 26 24 L 0 37 Z"
              fill="#F0FDFA"
              stroke="url(#headerLayersGrad)"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M -26 12 L 0 -1 L 26 12 L 0 25 Z"
              fill="#CCFBF1"
              stroke="url(#headerLayersGrad)"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M -26 0 L 0 -13 L 26 0 L 0 13 Z"
              fill="#99F6E4"
              stroke="url(#headerLayersGrad)"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Big Paper Plane */}
          <g>
            {/* Shadow fold */}
            <path
              d="M 260 275 L 445 190 L 310 365 Z"
              fill="url(#headerPlaneShadow)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Right wing fold */}
            <path
              d="M 445 190 L 310 365 L 348 322 Z"
              fill="url(#headerPlaneRight)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Main Left wing */}
            <path
              d="M 260 275 L 445 190 L 310 365 Z"
              fill="url(#headerPlaneMain)"
              stroke="#0F172A"
              strokeWidth="5.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Center spine */}
            <path
              d="M 260 275 L 445 190"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Shimmer top line */}
            <path
              d="M 265 277 L 440 192"
              stroke="#FCE7F3"
              strokeWidth="2.5"
              opacity="0.6"
              strokeLinecap="round"
            />

            {/* Golden rim highlight */}
            <path
              d="M 260 275 L 445 190 L 310 365 Z"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="1.5"
              opacity="0.75"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PostifyHeaderBanner;
