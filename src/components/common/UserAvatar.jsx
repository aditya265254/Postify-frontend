import React from "react";

/**
 * Reusable UserAvatar Component
 * Displays uppercase first letter avatar with configurable size and color
 */
export const UserAvatar = ({
  name = "U",
  size = "md", // "sm" | "md" | "lg" | "xl"
  className = "",
}) => {
  const firstLetter = (name && typeof name === "string" ? name.trim()[0] : "U").toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-8 text-xs rounded-xl",
    md: "w-10 h-10 text-sm rounded-2xl",
    lg: "w-12 h-12 text-base rounded-2xl",
    xl: "w-16 h-16 text-2xl rounded-2xl",
  };

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} bg-blue-600 text-white flex items-center justify-center font-extrabold uppercase shrink-0 shadow-xs border border-blue-500/30 ${className}`}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
