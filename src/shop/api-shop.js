import axios from '../axios';
import auth from '../auth/auth-helper'

const { accessToken } = auth.isAuthenticated()

// obj:params, str:accesstoken, shop:shopData
export const createShop = (params, shop) => {
  return axios
    .post(`/api/shops/by/${params.userId}`, shop, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    .then(resp => {
      // console.log(resp)
      const { status, data } = resp;

      if (status === (200 || 201)) {
        throw Error('error @createShop');
      }

      return data;
    })
    .catch(err => console.log(err));
};

export const listByOwner = async (params, signal) => {
  try {
    const response = await axios.get(`/api/shops/by/${params.userId}`, {
      signal,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (err) {
    console.log({ err });
    return err;
  }
};
