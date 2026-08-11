import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Globe } from 'lucide-react';
import api from '../config/api.js'; 
import Navbar from '../components/Navbar.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ message: '', statusCode: null });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');

    if (urlError) {
      setError({ message: urlError, statusCode: 429 });
      toast.error(urlError);
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError({ message: '', statusCode: null }); 

    try {
      const response = await api.post('/auth/login', { email, password });
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

      setError({
        message: errorMessage,
        statusCode: statusCode,
      });

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#1E1E24] text-slate-900 dark:text-zinc-100 relative transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="bg-white dark:bg-[#28282F] border border-slate-200/80 dark:border-[#3E3E48] p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-black text-center mb-2 text-slate-900 dark:text-zinc-100">
            Welcome Back
          </h2>
          <p className="text-xs text-center text-slate-500 dark:text-zinc-400 mb-6">
            Log in to your Postify account to stay connected
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-[#303038] border border-slate-300 dark:border-[#3E3E48] rounded-xl py-2.5 mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-[#303038] transition cursor-pointer shadow-xs"
          >
            <Globe className="w-4 h-4 text-slate-600 dark:text-zinc-300" /> Sign in with Google
          </button>

          <div className="flex items-center gap-3 text-slate-400 my-4 text-xs">
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#303038]" />
            <span>OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-[#303038]" />
          </div>

          {error.message && (
            <p className="text-red-500 text-xs mb-3 text-center font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/40">
              {error.statusCode && `${error.statusCode} — `}{error.message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 dark:bg-[#303038]/70 border border-slate-300 dark:border-[#3E3E48] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-50 dark:bg-[#303038]/70 border border-slate-300 dark:border-[#3E3E48] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-200 rounded-xl py-2.5 font-bold text-sm disabled:opacity-50 transition cursor-pointer shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white dark:text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-zinc-400 mt-6">
            Don't have an account?
            <span
              onClick={() => navigate('/signup')}
              className="text-slate-900 dark:text-zinc-100 cursor-pointer ml-1 font-bold hover:underline"
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


