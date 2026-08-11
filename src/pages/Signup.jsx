import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api.js'; 
import Navbar from '../components/Navbar.jsx';
import AuthForm from '../components/forms/AuthForm.jsx';

const Signup = () => {
  const [apiError, setApiError] = useState({ message: '', statusCode: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    setApiError({ message: '', statusCode: null });

    try {
      const response = await api.post('/auth/signup', {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Try again!';
      const statusCode = err.response?.data?.statusCode || err.response?.status;

      setApiError({ message: errorMessage, statusCode });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 relative transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-black text-center mb-1 text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
            Join the Postify community today
          </p>

          {apiError.message && (
            <p className="text-red-500 text-xs mb-3 text-center font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/40">
              {apiError.statusCode && `${apiError.statusCode} — `}{apiError.message}
            </p>
          )}

          {/* Reusable MVC AuthForm (Signup mode) */}
          <AuthForm
            mode="signup"
            onSubmit={handleSignupSubmit}
            loading={loading}
          />

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?
            <span
              onClick={() => navigate('/login')}
              className="text-blue-600 dark:text-blue-400 cursor-pointer ml-1 font-bold hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
