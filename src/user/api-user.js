import axios from '../axios';

import auth from '../auth/auth-helper'

const { accessToken } = auth.isAuthenticated()

export const read = async (params, signal) => {
  try {
    const response = await axios.get(`/api/users/${params.userId}`, {
      signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err
  }
};
