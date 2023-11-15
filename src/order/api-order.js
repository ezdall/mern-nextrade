import axios from '../axios';

import auth from '../auth/auth-helper';

const { accessToken } = auth.isAuthenticated();

export const createOrder = async (params, order, token) => {
  try {
    const response = await axios.post(
      `/api/orders/${params.userId}`,
      { order, token },
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const update = async (params, product) => {
  try {
    const response = await axios.patch(
      `/api/order/status/${params.shopId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const cancelOrder = async (params, product) => {
  try {
    const response = await axios.patch(
      `/api/order/${params.shopId}/cancel/${params.productId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const processCharge = async (params, product) => {
  try {
    const response = await axios.patch(
      `/api/order/${params.orderId}/charge/${params.userId}/${params.shopId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getStatusValues = async signal => {
  try {
    const response = await axios.get('/api/order/status-val', {
      signal
    });
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const listByShop = async (params, signal) => {
  try {
    console.log({ accessToken });
    const response = await axios.get(`/api/orders/shop/${params.shopId}`, {
      signal,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const listByUser = async (params, signal) => {
  try {
    const response = await axios.get(`/api/orders/user/${params.userId}`, {
      signal,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const readOrder = async (params, signal) => {
  try {
    const response = await axios.get(`/api/order/${params.orderId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      signal
    });
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};
