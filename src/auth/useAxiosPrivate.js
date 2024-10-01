import { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { axiosPrivate } from '../axios';

import useRefresh from './useRefresh';

export default function useAxiosPrivate() {
  const refresh = useRefresh();
  const { accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        // attached accessToken
        if (!config.headers.authorization && accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.authorization = `Bearer ${accessToken}`;
        }
        // dev checking
        console.log(
          `Intercept reQ ${config?.signal?.aborted || ''} ${config.method} ${
            config.url
          }`
        );
        console.log({ configIntercept: config });
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response, // nothing change here

      async error => {
        if (error.code === 'ERR_CANCELED') {
          console.log('canceled private-axios');
          return Promise.reject(error);
          // return console.log('canceled private-axios');
        }
        // error handling
        console.log('Intercept resP');
        if (error?.response) {
          const prevReq = error?.config;
          if (
            error?.response?.data?.inner?.name === 'TokenExpiredError' &&
            !prevReq?.sent
          ) {
            console.log('error accessToken Expired');

            prevReq.sent = true;
            const newAccessToken = await refresh();
            prevReq.headers.authorization = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevReq);
          }

          console.log({ errCode: error.code });
          console.log({ errorInterResP: error });
        } else if (error?.request) {
          console.log({ errorInterReQ: error });
          return null;
        } else {
          console.log({ errorInterGeN: error });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
      console.log('abort intercepts');
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
}
