import React from "react";
import headerGraphicImg from "../assets/img.png";

export const PostifyHeaderBanner = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center p-2 rounded-xl ${className}`}>
      <img
        src={headerGraphicImg}
        alt="Postify Header Artwork"
        className="w-full max-w-[260px] sm:max-w-[290px] aspect-square rounded-full h-auto object-contain dark:opacity-90 dark:mix-blend-luminosity transition-all duration-300 drop-shadow-md"
      />
    </div>
  );
};

export default PostifyHeaderBanner;