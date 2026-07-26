import {   Route, Routes,  } from 'react-router-dom'
import AdminDashbord from '../pages/AdminDashbord'
import ProtectedAdminRoute from './ProtectedAdminRoute'

  

const ProtectedRoutes = () => {
    

  return (
    <>
    <Routes>

    <Route 
          path='/admin/dashboard' 
          element={
            <ProtectedAdminRoute>
              <AdminDashbord />
             </ProtectedAdminRoute>
          } 
          />
          </Routes>
    </>
  )
}

export default ProtectedRoutes