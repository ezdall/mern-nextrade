import { useState, useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import useRefresh from './useRefresh';
// import useDataContext from './useDataContext';
// import { addAuth } from '../redux/auth.slice';

export default function PersistLogin() {
  // const { auth } = useDataContext()
  const [isLoading, setIsLoading] = useState(true);
  const runOnce = useRef(true);
  const refresh = useRefresh();
  const { accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error({ errPersistLogin: err });
      } finally {
        setIsLoading(false);
      }
    };

    if (runOnce.current) {
      if (!accessToken) {
        console.log('verifyingRefresh');
        verifyRefreshToken();
      } else {
        setIsLoading(false);
      }
    }

    return () => {
      runOnce.current = false;
      console.log('clean persist-login');
    };
  }, [accessToken, refresh]);

  useEffect(() => {
    // console.log({ isLoading });
    // console.log({ persistLoginAuth: auth });
  }, [accessToken, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  return <Outlet />;
}
