import { useEffect } from 'react';
import { axiosPrivate } from '../axios';

import useRefresh from './useRefresh';
import useDataContext from './useDataContext';

export default function useAxiosPrivate() {
  const refresh = useRefresh();
  const { auth } = useDataContext();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers.authorization) {
          // eslint-disable-next-line no-param-reassign
          config.headers.authorization = `Bearer ${auth?.accessToken}`;
        }
        console.log('requestIntercept:');
        console.log({ configIntercept: config });
        // eslint-disable-next-line no-param-reassign
        // config.withCredentials = true;
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        console.log('responseIntercept!');
        console.log({ errorIntercept: error });
        const prevReq = error?.config;
        // response.data.inner.name = TokenExpiredError, JsonWebTokenError
        if (
          error?.response?.data?.inner?.name === 'TokenExpiredError' &&
          !prevReq?.sent
        ) {
          console.log('token Expire');

          prevReq.sent = true;
          const newAccessToken = await refresh();
          prevReq.headers.authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevReq);
        }

        console.log({ prevReq });
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}
