import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return; 

    setLoading(true); 
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password })
      
      localStorage.setItem("token", response.data.data.token)
      localStorage.setItem("role", response.data.data.user.role)
      localStorage.setItem("user", JSON.stringify(response.data.data.user))
      
      toast.success("Login successful!"); 

      if (response.data.data.user.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      // Backend ka message nikalte hain
      const errorMessage = error.response?.data?.message || "Something went wrong";
      const statusCode = error.response?.data?.statusCode || error.response?.status;

      setError({
        message: errorMessage,
        statusCode: statusCode
      })

      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const hadndleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/google`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            
            <button 
                type='button' 
                onClick={hadndleGoogleLogin}
                className="w-full border border-gray-300 rounded-lg py-2 mb-4 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
                Sign in with Google
            </button>

            <div className="text-center text-gray-400 mb-4">or</div>

            {error.message && (
                <p className="text-red-500 text-sm mb-3">
                    {error.statusCode} — {error.message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
               
                <button 
                    type='submit'
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      "Login"
                    )}
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                Account nahi h? 
                <span 
                    onClick={() => navigate('/signup')}
                    className="text-blue-500 cursor-pointer ml-1"
                >
                    Sign up
                </span>
            </p>

        </div>
    </div>
  )
}

export default Login;