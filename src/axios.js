import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_URL;
// 'http://localhost:3000';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 1000 * 3 // 3sec
});

instance.interceptors.response.use(
  response => response, // nothing here

  error => {
    // handle axios-abort somewhat conflict w/ React-18
    // if (error.code === 'ERR_CANCELED') { }

    // error handling
    console.log('Inter resP');
    if (error.code === 'ERR_CANCELED') {
      console.log('canceled axios');
    } else if (error.code === 'ERR_NETWORK') {
      console.log({ errIntNet: error.message });
    } else if (error?.response) {
      console.error({ errIntResp: error });
    } else if (error?.request) {
      console.log({ errIntReQ: error });
    } else {
      console.log({ errIntGeN: error });
    }

    return Promise.reject(error);
  }
);

export default instance;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 1000 * 3 // 3sec
});

export const onAxiosError = () => ({});

export const handleAxiosError = (
  error,
  cb = () => console.log('axios default')
) => {
  const { response } = error;

  if (!response) {
    console.log({ error });
    // setErrCb('No Server Response');
    // return;
  }

  // axios error
  if (response.status === 400) {
    const axErrMsg = response.data.error;

    console.log({ error });

    // setErrCb(axErrMsg);
    // return;
  }

  if (response.status === 401) {
    const { inner } = response.data;

    console.log({ error });

    if (inner.name === 'TokenExpiredError') {
      console.log('innnerrrrr');
      if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
      if (cb) cb();
    }
  }
};
