import { useState, useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import useRefresh from './useRefresh';

/**
 * Component responsible for persisting user login by refreshing access tokens.
 * Renders child routes once the loading state is complete.
 *
 */

export default function PersistLogin() {
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
      // refresh, if no token
      if (!accessToken) {
        console.log('verify refresh-token');
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

  // useEffect(() => {
  // console.log({ isLoading });
  // console.log({ persistLoginToken: accessToken });
  // }, [accessToken, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  return <Outlet />;
}
