import axios from '../axios';

export const login = async user => {
  try {
    const response = await axios.post('/auth/login', user);

    return response.data;
  } catch (err) {
    return err;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get('/auth/logout');

    return response.data;
  } catch (err) {
    return err;
  }
};
