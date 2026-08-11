import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Globe } from 'lucide-react';
import api from '../config/api.js'; 
import Navbar from '../components/Navbar.jsx';
import AuthForm from '../components/forms/AuthForm.jsx';

const Login = () => {
  const [apiError, setApiError] = useState({ message: '', statusCode: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');

    if (urlError) {
      setApiError({ message: urlError, statusCode: 429 });
      toast.error(urlError);
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleLoginSubmit = async (data) => {
    if (loading) return;

    setLoading(true);
    setApiError({ message: '', statusCode: null }); 

    try {
      const response = await api.post('/auth/login', {
        email: data.email.trim(),
        password: data.password,
      });
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Login successful!');

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); 
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      const statusCode = err.response?.data?.statusCode || err.response?.status;

      setApiError({ message: errorMessage, statusCode });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseURL = api.defaults.baseURL;
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 relative transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-[#1C2A4A] p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-black text-center mb-1 text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
            Log in to your Postify account to stay connected
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-[#141D33] border border-slate-300 dark:border-[#1C2A4A] rounded-xl py-2.5 mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1C2A4A] transition cursor-pointer shadow-xs"
          >
            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-300" /> Sign in with Google
          </button>

          <div className="flex items-center gap-3 text-slate-400 my-4 text-xs">
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#1C2A4A]" />
            <span>OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#1C2A4A]" />
          </div>

          {apiError.message && (
            <p className="text-red-500 text-xs mb-3 text-center font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/40">
              {apiError.statusCode && `${apiError.statusCode} — `}{apiError.message}
            </p>
          )}

          {/* Reusable MVC AuthForm (Login mode) */}
          <AuthForm
            mode="login"
            onSubmit={handleLoginSubmit}
            loading={loading}
          />

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?
            <span
              onClick={() => navigate('/signup')}
              className="text-blue-600 dark:text-blue-400 cursor-pointer ml-1 font-bold hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
