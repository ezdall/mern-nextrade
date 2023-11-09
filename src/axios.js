import axios from 'axios';

export const BASE_URL = 'http://localhost:3000';

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

export const handleAxiosError = (error, cb) => {
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
    const {error:axErrMsg, inner} = response.data;

    console.log({ error });

    if(inner.name === 'TokenExpiredError'){
      console.log('innnerrrrr')
       if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
      cb()
    }

    // setErrCb(axErrMsg);
    // return;
  }

  // return
  // axios + mongoose error
  // error.response.data.error.code === 11000
  // error.response.data.error.keyValue.email === '...@...'
};
