import AdminDashbord from "../pages/AdminDashbord";
import AdminUserPosts from "../pages/AdminUserPosts"; 
import ProtectedAdminRoute from "./ProtectedAdminRoute";

export const protectedRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedAdminRoute>
        <AdminDashbord />
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/user/:userId",
    element: (
      <ProtectedAdminRoute>
        <AdminUserPosts />
      </ProtectedAdminRoute>
    )
  }
];