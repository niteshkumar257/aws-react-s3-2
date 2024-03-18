import jwt_decode from "jwt-decode";
import { Navigate, Outlet, useLocation } from "react-router-dom";
const GlobalAuth = () => {
  const user = localStorage.getItem("auth_token");
  const location = useLocation();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default GlobalAuth;
