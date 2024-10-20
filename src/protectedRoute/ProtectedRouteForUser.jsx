/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"; // Ensure correct import

export const ProtectedRouteForUser = ({ children }) => {
  let user = null;

  // Safely parse user from localStorage
  try {
    user = JSON.parse(localStorage.getItem('users'));
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  // Check if user is authenticated
  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
