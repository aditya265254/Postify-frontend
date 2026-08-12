import headerGraphicImg from "../assets/img.png";

import headerGraphicImgDark from "../assets/img-dark.png";


import { useTheme } from "../context/ThemeContext";

export const PostifyHeaderBanner = ({ className = "" }) => {

const context =  useTheme()
console.log(context)
console.log("Context", headerGraphicImgDark)

  return (
    <div className={`relative flex items-center justify-center p-2 rounded-xl ${className}`}>

{
  context.theme === "dark" ?     <img
        src={headerGraphicImgDark}
        alt="Postify Header Artwork"
        className="w-full max-w-[260px] sm:max-w-[290px] aspect-square rounded-full h-auto object-contain dark:opacity-90 dark:mix-blend-luminosity transition-all duration-300 drop-shadow-md fade-in"
      /> 
      :     <img
        src={headerGraphicImg}
        alt="Postify Header Artwork"
        className="w-full max-w-[260px] sm:max-w-[290px] aspect-square rounded-full h-auto object-contain dark:opacity-90 dark:mix-blend-luminosity transition-all duration-300 drop-shadow-md"
      />
}

      {/* <img
        src={headerGraphicImg}
        alt="Postify Header Artwork"
        className="w-full max-w-[260px] sm:max-w-[290px] aspect-square rounded-full h-auto object-contain dark:opacity-90 dark:mix-blend-luminosity transition-all duration-300 drop-shadow-md"
      /> */}
    </div>
  );
};

export default PostifyHeaderBanner;