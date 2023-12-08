import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from '../axios';

// import useDataContext from './useDataContext';
import { addAuth } from '../redux/auth.slice';

export default function useRefresh() {
  // const { auth, setAuth } = useDataContext()
  const location = useLocation();
  const dispatch = useDispatch();

  return async () => {
    try {
      const resp = await axios.get('/auth/refresh', {
        // withCredentials: true
      });
      console.log('refresh at:', location.pathname);

      const { accessToken, user } = resp.data;

      // dispatch(addAuth(prev => ({ ...prev, accessToken, user })))
      dispatch((dispatchT, getState) => {
        // return dispatch(addAuth(getSt))
        const prev = getState().auth;
        return dispatchT(addAuth({ ...prev, accessToken, user }));
      });

      return accessToken;
    } catch (err) {
      if (err?.isAxiosError) {
        console.error({ errRefresh: err?.response.data });
        // return err.response.data.error
      }
      // console.log(err);

      return err;
    }
  };
}
