import axios from '../axios';
import auth from '../auth/auth-helper';

const { accessToken } = auth.isAuthenticated();

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

export const readShop = async (params, signal) => {
  try {
    const response = await axios.get(`/api/shop/${params.shopId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateShop = async (params, shop) => {
  try {
    const response = await axios.patch(`/api/shops/${params.shopId}`, shop, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const removeShop = async params => {
  try {
    const response = await axios.delete(`/api/shops/${params.shopId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const list = async signal => {
  try {
    const response = await axios.get('/api/shops', {
      signal
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const listByOwner = async (params, signal, accessToken1) => {
  try {
    const accessToken2 = auth.isAuthenticated().accessToken

    const response = await axios.get(`/api/shops/by/${params.userId}`, {
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
