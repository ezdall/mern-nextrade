import axios from '../axios';

export const login = async user => {
  try {
    const response = await axios.post('/auth/login', user, {
      withCredentials: true, // you want to receive cookie
      headers: {
        Accept: 'application/json', // you only accept json
        'Content-Type': 'application/json'
      }
    });

    console.log({ response });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get('/auth/logout');

    return response.data;
  } catch (err) {
    return console.log(err);
  }
};
