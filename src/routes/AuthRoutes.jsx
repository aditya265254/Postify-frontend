import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import VerifyEmail from "../pages/VerifyEmail";

export const authRoutes = [
  { path: '/', element: <Dashboard/> },          
  { path: '/dashboard', element: <Dashboard/> }, 
  { path: '/login', element: <Login/> },         
  { path: '/signup', element: <Signup/> },
  { path: '/verify-email', element: <VerifyEmail /> }
];