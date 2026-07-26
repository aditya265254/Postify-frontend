import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 



const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      
      
    </Routes>
    </BrowserRouter>
  )
}

export default App