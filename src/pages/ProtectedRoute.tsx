import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, refreshAccessToken, isLoading } = useAuth();
  const [, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        await refreshAccessToken();
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [isAuthenticated, refreshAccessToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
