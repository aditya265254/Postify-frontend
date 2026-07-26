import { createBrowserRouter } from 'react-router-dom'
import { authRoutes } from './AuthRoutes'  
import { protectedRoutes } from './ProtectedRoutes' 
import { PostRoutes } from './PostRoutes'

export const AppRouter = createBrowserRouter([
    ...authRoutes,       
    ...protectedRoutes,
    ...PostRoutes
])