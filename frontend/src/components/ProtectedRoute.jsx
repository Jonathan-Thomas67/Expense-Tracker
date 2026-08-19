import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAuthenticated } from "../services/auth";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
