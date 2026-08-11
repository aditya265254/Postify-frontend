import React from "react";
import logoImg from "../assets/postify-logo.png";

/**
 * PostifyLogo Component
 * Uses the exact image uploaded by the user without any changes in Light mode,
 * and automatically adapts via invert in Dark mode.
 */
export const PostifyLogo = ({ variant = "navbar", className = "" }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="Postify - Community Driven Publishing"
        className="h-9 sm:h-10 w-auto object-contain mix-blend-multiply dark:invert dark:mix-blend-screen transition-all duration-300"
      />
    </div>
  );
};

export default PostifyLogo;
