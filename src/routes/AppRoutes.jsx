import { createBrowserRouter } from 'react-router-dom'
import { authRoutes } from './AuthRoutes' // {} me import
import { protectedRoutes } from './ProtectedRoutes' // {} me import

export const AppRouter = createBrowserRouter([
    ...authRoutes,       
    ...protectedRoutes 
])