import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Dashboard from "../pages/Dashboard"
import VerifyEmail from "../pages/VerifyEmail"


export const authRoutes = [
  { path: '/', element: <Login/> },
  { path: '/signup', element: <Signup/> },
  { path: '/dashboard', element: <Dashboard/> },
  { path: '/verify-email', element: <VerifyEmail /> }
]