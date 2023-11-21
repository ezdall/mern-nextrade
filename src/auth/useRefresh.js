import axios from '../axios';

import useDataContext from './useDataContext';

export default function useRefreshToken() {
  const { auth, setAuth } = useDataContext();

  const refresh = async () => {
    try {
      console.log('refreshing');
      const resp = await axios.get(`/auth/refresh`, {
        withCredentials: true
      });

      const { accessToken, user } = resp.data;

      setAuth(prev => {
        // console.log(prev)
        // console.log(resp.data.accessToken)
        return { ...prev, accessToken, user };
      });

      return resp.data.accessToken;
    } catch (err) {
      // throw err
      console.log({ errRefresh: err, auth });
      return err;
    }
  };
  return refresh;
}
