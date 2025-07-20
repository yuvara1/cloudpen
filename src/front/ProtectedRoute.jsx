import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
     // Check if the user is logged in (e.g., by checking localStorage or cookies)
     const isLoggedIn = localStorage.getItem('username') !== null;

     // If not logged in, redirect to the login page
     if (!isLoggedIn) {
          return <Navigate to="/" replace />;
     }

     // If logged in, render the children components
     return children;
};

export default ProtectedRoute;