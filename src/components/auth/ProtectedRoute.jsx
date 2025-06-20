import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    setHasToken(!!token);
  }, []);

  if (!isAuthenticated && !hasToken) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
