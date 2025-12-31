import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Context } from "../context/contextApi";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useContext(Context);
  const location = useLocation();

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
