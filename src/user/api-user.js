import axios from '../axios';

import auth from '../auth/auth-helper';

export const createUser = async (user) => {
  try {
    const response = await axios.post('/auth/register', user)

    return await response.data
  } catch(err) {
    // console.log(err)
    return err
  }
}

export const read = async (params, signal, accessToken1) => {
  try {
    const { accessToken } = auth.isAuthenticated();
    // console.log(accessToken)

    const response = await axios.get(`/api/users/${params.userId}`, {
      signal,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    console.log({response})
    return response.data;
  } catch (err) {
    // console.log(err);
    return err;
  }
};

export const updateUser = async (params, user, accessToken1) => {
  try {
    const { accessToken } = auth.isAuthenticated();
    console.log({accessToken})

    const response = await axios.patch(`/api/users/${params.userId}`, user, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    // console.log({response})
    return response.data; // user
  } catch (err) {
    // console.log(err);
    return err;
  }
};

export const removeUser = async (params) => {
  try {
    const { accessToken } = auth.isAuthenticated();
    
    const response = await axios.delete(`/api/users/${params.userId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    return await response.data
  } catch(err) {
    // console.log(err)
    return err
  }
}

export const usersList = async (signal) => {
  try {

    const response = await axios.get('/api/users', {
      signal
    });
    return response.data;
  } catch (err) {
    // console.log(err);
    return err;
  }
};
