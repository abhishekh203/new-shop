/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"; // Correct import

export const ProtectedRouteForAdmin = ({ children }) => {
  let user = null;

  // Safely parse user from localStorage
  try {
    user = JSON.parse(localStorage.getItem('users'));
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  // Check if user exists and is an admin
  if (user?.role === "admin") {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
