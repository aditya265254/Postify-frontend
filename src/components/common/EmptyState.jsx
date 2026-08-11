import React from "react";

/**
 * Reusable EmptyState Component
 * Used for empty lists, feeds, and search results
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`text-center bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] p-12 rounded-3xl shadow-xs ${className}`}>
      {Icon && <Icon className="w-12 h-12 text-slate-400 dark:text-slate-500 stroke-1 mx-auto mb-3" />}
      {title && (
        <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
          {title}
        </p>
      )}
      {description && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
