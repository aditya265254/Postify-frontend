import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api.js'; 
import Navbar from '../components/Navbar.jsx';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ message: '', statusCode: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError({ message: '', statusCode: null });

    try {
      const response = await api.post('/auth/signup', { fullName, email, password });

      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Try again!';
      const statusCode = err.response?.data?.statusCode || err.response?.status;

      setError({ message: errorMessage, statusCode });
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

          {error.message && (
            <p className="text-red-500 text-xs mb-3 text-center font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/40">
              {error.statusCode && `${error.statusCode} — `}{error.message}
            </p>
          )}

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-slate-50 dark:bg-[#141D33] border border-slate-300 dark:border-[#1C2A4A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 dark:bg-[#141D33] border border-slate-300 dark:border-[#1C2A4A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-50 dark:bg-[#141D33] border border-slate-300 dark:border-[#1C2A4A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />

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
                  <span>Registering...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

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


