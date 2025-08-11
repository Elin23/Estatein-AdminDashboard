import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { type RootState } from "../../redux/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

  const userRole = useSelector((state: RootState) => state.auth.role);

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;