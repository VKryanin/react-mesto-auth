import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ element: Component, ...props }) => {
  const { pathname } = useLocation();
  return props.loggedIn ? <Component {...props} /> : <Navigate to='/signin' state={{ backUrl: pathname }} />;
}