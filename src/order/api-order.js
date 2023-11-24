import axios from '../axios';

export const createOrder = async ({
  userId,
  accessToken2,
  axiosPrivate,
  order,
  token
}) => {
  try {
    const response = await axiosPrivate.post(
      `/api/orders/${userId}`,
      { order, token },
      {
        headers: {
          authorization: `Bearer ${accessToken2}`
        }
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const update = async ({
  shopId,
  axiosPrivate,
  accessToken2,
  product
}) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/order/status/${shopId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken2}`
        }
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const cancelOrder = async ({
  shopId,
  productId,
  product,
  axiosPrivate,
  accessToken2
}) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/order/${shopId}/cancel/${productId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken2}`
        }
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const processCharge = async ({
  shopId,
  orderId,
  userId,
  product,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/order/${orderId}/charge/${userId}/${shopId}`,
      product,
      {
        headers: {
          authorization: `Bearer ${accessToken2}`
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
    return err;
  }
};

export const listByShop = async ({
  shopId,
  signal,
  axiosPrivate,
  accessToken2
}) => {
  try {
    const response = await axiosPrivate.get(`/api/orders/shop/${shopId}`, {
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

export const listByUser = async ({
  userId,
  signal,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.get(`/api/orders/user/${userId}`, {
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

export const readOrder = async ({ orderId, signal }) => {
  try {
    const response = await axios.get(`/api/order/${orderId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    return err;
  }
};
