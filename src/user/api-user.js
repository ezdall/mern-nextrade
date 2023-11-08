import axios from '../axios';

export const read = async (params, accessToken, signal) => {
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
    return console.log(err);
  }
};
