import axios from '../axios';

export const createUser = async userData => {
  try {
    const response = await axios.post('/auth/register', userData);

    return await response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const usersList = async ({ signal }) => {
  try {
    const response = await axios.get('/api/users', {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const read = async ({ userId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/users/${userId}`, {
      signal
    });

    // console.log({ read: response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateUser = async ({ user, userId, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.patch(`/api/users/${userId}`, user);

    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const removeUser = async ({ userId, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.delete(`/api/users/${userId}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// from local.search >> code: "ac_PvfdPjM2VqzycLQKCqt1b5C6coS6EQ9A"
export const stripeUpdate = async ({ code, signal, userId, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.patch(
      `/api/stripe-auth/${userId}`,
      { stripe: code },
      { signal }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
