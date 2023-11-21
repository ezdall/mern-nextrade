import axios from '../axios';
import auth from '../auth/auth-helper';

const { accessToken } = auth.isAuthenticated();

// obj:params, str:accesstoken, shop:shopData
export const createShop = (params, shop, accessToken2, axiosPrivate) => {
  return axiosPrivate
    .post(`/api/shops/by/${params.userId}`, shop, {
      headers: {
        authorization: `Bearer ${accessToken2}`
      }
    })
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      return err;
    });
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

export const updateShop = async (params, shop, accessToken2, axiosPrivate) => {
  try {
    const response = await axiosPrivate.patch(`/api/shops/${params.shopId}`, shop, {
      headers: {
        authorization: `Bearer ${accessToken2}`
      }
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const removeShop = async (params, accessToken2, axiosPrivate) => {
  try {
    const response = await axiosPrivate.delete(`/api/shops/${params.shopId}`, {
      headers: {
        authorization: `Bearer ${accessToken2}`
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

export const listByOwner = async (params, signal, accessToken2, axiosPrivate) => {
  try {
    const response = await axiosPrivate.get(`/api/shops/by/${params.userId}`, {
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
