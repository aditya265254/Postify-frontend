import React from "react";


export const FormTextArea = ({
  placeholder,
  name,
  register,
  rules,
  error,
  rows = 4,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        rows={rows}
        {...(register ? register(name, rules) : {})}
        className={`w-full bg-slate-50 dark:bg-[#141D33] border rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white resize-none transition focus:outline-none ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-400"
            : "border-slate-200 dark:border-[#1C2A4A] focus:border-blue-500 dark:focus:border-blue-400"
          } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-[11px] font-medium ml-1 mt-1 block">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormTextArea;
