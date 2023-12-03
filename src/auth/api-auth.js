import axios from '../axios';

// must have withCredentials
// to receive cookie
// and to send req with cookie

export const login = async ({ user }) => {
  try {
    const response = await axios.post('/auth/login', user, {
      timeout: 1000 * 5 // 5s
    });

    console.log({ respLogin: response });

    return response.data;
  } catch (error) {
    console.log({ errLogin: error });
    throw error;
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
  } catch (error) {
    return console.error({ errLogout: error });
    // return error
  }
};
