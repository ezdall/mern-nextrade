import axios from '../axios';

/**
 * must have withCredentials
 * to receive cookie
 * and to send req with cookie
 *
 */

export const login = async ({ user }) => {
  try {
    const response = await axios.post('/auth/login', user, {
      timeout: 1000 * 5 // 5sec
    });

    console.log({ respLogin: response });

    return response.data;
  } catch (error) {
    console.log({ errLogin: error });
    return error;
  }
};

export const logout = async ({ dispatchResetAuth, clearCart }) => {
  try {
    const response = await axios.get('/auth/logout', {
      withCredentials: true
    });

    console.log({ dispatchResetAuth });

    if (response.data.status === 204) {
      clearCart();
      return dispatchResetAuth();

      // return navigateHome() // creates conflict
    }

    return null;
  } catch (error) {
    return console.error({ errLogout: error });
  }
};
