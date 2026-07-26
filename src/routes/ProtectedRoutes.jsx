import AdminDashbord from "../pages/AdminDashbord";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

export const protectedRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedAdminRoute>
        <AdminDashbord />
      </ProtectedAdminRoute>
    )
  }
]