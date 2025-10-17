import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function RoleGuard({ allow = [] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
