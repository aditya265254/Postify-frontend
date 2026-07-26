import AdminDashboard from "../pages/AdminDashboard";
import AdminUserPosts from "../pages/AdminUserPosts"; // Import the new page

export const ProtectedAdminRoutes = [
    { path: '/admin/dashboard', element: <AdminDashboard /> },
    { path: '/admin/user/:userId', element: <AdminUserPosts /> } 
];