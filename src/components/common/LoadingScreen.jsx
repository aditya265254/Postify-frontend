import React from "react";

/**
 * Reusable LoadingScreen Component
 */
export const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-3 bg-white dark:bg-[#0D1424] p-6 rounded-3xl border border-slate-200 dark:border-[#1C2A4A] shadow-md">
        <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
