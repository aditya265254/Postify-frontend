import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "../common/FormInput.jsx";


export const AuthForm = ({
  mode = "login", // "login" | "signup"
  onSubmit,
  loading = false,
  apiError = null,
}) => {
  const isSignup = mode === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Full Name Field (Signup Mode Only) */}
      {isSignup && (
        <FormInput
          type="text"
          placeholder="Full Name"
          name="fullName"
          register={register}
          rules={{
            required: "Full name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          }}
          error={errors.fullName}
        />
      )}

      {/* Email Field */}
      <FormInput
        type="email"
        placeholder="Email address"
        name="email"
        register={register}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        error={errors.email}
      />

      {/* Password Field */}
      <FormInput
        type="password"
        placeholder="Password"
        name="password"
        register={register}
        rules={{
          required: "Password is required",
          minLength: isSignup
            ? { value: 6, message: "Password must be at least 6 characters" }
            : undefined,
        }}
        error={errors.password}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-bold text-sm disabled:opacity-50 transition cursor-pointer shadow-md shadow-blue-500/20 mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{isSignup ? "Registering..." : "Logging in..."}</span>
          </>
        ) : (
          isSignup ? "Sign Up" : "Login"
        )}
      </button>
    </form>
  );
};

export default AuthForm;
