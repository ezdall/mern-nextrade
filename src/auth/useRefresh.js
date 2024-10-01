// import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../axios';

import { addAuth } from '../redux/auth.slice';

export default function useRefresh() {
  const dispatch = useDispatch();
  // const location = useLocation();

  return async () => {
    try {
      const resp = await axios.get('/auth/refresh');
      // console.log('refresh at:', location.pathname);

      const { accessToken, user } = resp.data;

      dispatch(addAuth({ accessToken, user }));

      return accessToken;
    } catch (err) {
      if (err?.isAxiosError) {
        console.error({ errRefresh: err?.response.data });
      }

      // ??
      return err;
    }
  };
}
