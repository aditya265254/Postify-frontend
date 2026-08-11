import React from "react";
import { ShieldCheck } from "lucide-react";

/**
 * Reusable RoleBadge Component
 * Renders stylized Admin/User role pill
 */
export const RoleBadge = ({ role = "user", showIcon = false, className = "" }) => {
  const isAdmin = role === "admin";

  return (
    <span
      className={`w-20 justify-center text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 shrink-0 uppercase tracking-wider ${
        isAdmin
          ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50"
          : "bg-slate-100 dark:bg-[#141D33] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1C2A4A]"
      } ${className}`}
    >
      {showIcon && isAdmin && <ShieldCheck className="w-3 h-3 text-red-600 dark:text-red-400" />}
      {role}
    </span>
  );
};

export default RoleBadge;
