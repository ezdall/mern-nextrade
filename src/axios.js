import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_URL;
// 'http://localhost:3000';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

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
      cb();
    }
  }
};
