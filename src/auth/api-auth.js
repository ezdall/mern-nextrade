import axios from '../axios';

// must have withCredentials
// to receive cookie
// and to send req with cookie

export const login = async user => {
  try {
    const response = await axios.post('/auth/login', user, {
      withCredentials: true
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const logout = async ({ navigateHome, setAuth, dispatchResetAuth }) => {
  try {
    const response = await axios.get('/auth/logout', {
      withCredentials: true
    });

    if (response.data.status === 204) {
      setAuth();
      dispatchResetAuth();
      return navigateHome();
    }

    return null;
  } catch (err) {
    return console.error({ errLogout: err });
    // return err;
  }
};
