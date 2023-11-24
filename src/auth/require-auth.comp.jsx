import { useLocation, Navigate, Outlet } from 'react-router-dom';

import useDataContext from './useDataContext';

export default function RequireAuth() {
  const location = useLocation();
  const { auth } = useDataContext();

  console.log({ requireAuth: auth });

  return auth?.user ? (
    <Outlet />
  ) : (
    // <div />
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// auth.role?.find(r => allowedRoles.includes(r))
//  ? <Outlet />
//  : auth?.user
//    ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//    : <Navigate to="/login" state={{ from: location }} replace />
