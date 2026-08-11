import React from "react";

export const FormInput = ({
  type = "text",
  placeholder,
  name,
  register,
  rules,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        {...(register ? register(name, rules) : {})}
        className={`w-full bg-slate-50 dark:bg-[#141D33] border rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 ${error
            ? "border-red-400 focus:ring-red-400"
            : "border-slate-300 dark:border-[#1C2A4A] focus:ring-blue-500 dark:focus:ring-blue-400"
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

export default FormInput;
