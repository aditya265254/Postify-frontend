import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * Reusable Center Screen ConfirmModal Component
 * Replaces native browser alert/confirm popups with a beautiful centered modal card
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "danger", // "danger" | "primary" | "warning"
  loading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20",
    warning: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20",
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-[100] px-4 py-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-[#1C2A4A] p-6 sm:p-7 rounded-3xl shadow-2xl w-full max-w-md relative text-center scale-100 transition-all">
        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Danger Icon Badge */}
        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900/50 shadow-inner">
          <Trash2 className="w-7 h-7" />
        </div>

        {/* Title & Message */}
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 dark:border-[#1C2A4A] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#141D33] hover:bg-slate-200 dark:hover:bg-[#1C2A4A] transition border border-slate-200 dark:border-[#1C2A4A] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-md disabled:opacity-50 ${
              variantStyles[confirmVariant] || variantStyles.danger
            }`}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
