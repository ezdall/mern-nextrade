import axios from '../axios';

export const createUser = async userData => {
  try {
    const response = await axios.post('/auth/register', userData);

    return await response.data;
  } catch (err) {
    return err;
  }
};

export const read = async ({ userId, signal, accessToken2, axiosPrivate }) => {
  try {
    const response = await axiosPrivate.get(`/api/users/${userId}`, {
      signal,
      headers: {
        authorization: `Bearer ${accessToken2}`
      }
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateUser = async ({
  userId,
  user,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.patch(`/api/users/${userId}`, user, {
      headers: {
        authorization: `Bearer ${accessToken2}`
      }
    });
    return response.data; // user
  } catch (err) {
    return err;
  }
};

export const removeUser = async ({ userId, accessToken2, axiosPrivate }) => {
  try {
    const response = await axiosPrivate.delete(`/api/users/${userId}`, {
      headers: {
        authorization: `Bearer ${accessToken2}`
      }
    });
    return await response.data;
  } catch (err) {
    return err;
  }
};

export const stripeUpdate = async (
  code,
  signal,
  user,
  accessToken2,
  axiosPrivate
) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/stripe-auth/${user._id}`,
      { stripe: code },
      {
        signal,
        headers: {
          authorization: `Bearer ${accessToken2}`
        }
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const usersList = async signal => {
  try {
    const response = await axios.get('/api/users', {
      signal
    });
    return response.data;
  } catch (err) {
    return err;
  }
};
