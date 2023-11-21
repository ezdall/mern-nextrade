import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import useRefresh from './useRefresh';
import useDataContext from './useDataContext';

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const { auth } = useDataContext();

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

    if (!auth?.accesToken) {
      console.log('verifyingRefresh');
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // console.log({ isLoading });
    // console.log({ persistLoginAuth: auth });
  }, [auth, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  return <Outlet />;
}
