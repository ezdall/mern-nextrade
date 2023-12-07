import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import useDataContext from './useDataContext';

export default function RequireAuth() {
  // const { auth } = useDataContext();
  const location = useLocation();
  const auth = useSelector(state => state.auth);

  // console.log({ requireAuth: auth });

  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// auth.role?.find(r => allowedRoles.includes(r))
//  ? <Outlet />
//  : auth?.user
//    ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//    : <Navigate to="/login" state={{ from: location }} replace />
