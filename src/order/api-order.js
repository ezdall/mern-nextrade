import axios from '../axios';

export const readOrder = async ({ orderId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/order/${orderId}`, {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createOrder = async ({ userId, axiosPrivate2, order, token }) => {
  try {
    const response = await axiosPrivate2.post(`/api/orders/${userId}`, {
      order,
      token
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const update = async ({ shopId, axiosPrivate2, product }) => {
  try {
    const response = await axiosPrivate2.patch(
      `/api/order/status/${shopId}`,
      product
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const cancelOrder = async ({
  shopId,
  productId,
  product,
  axiosPrivate2
}) => {
  try {
    const response = await axiosPrivate2.patch(
      `/api/order/${shopId}/cancel/${productId}`,
      product
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const processCharge = async ({
  shopId,
  orderId,
  userId,
  product,
  axiosPrivate2
}) => {
  try {
    console.log({
      shopId,
      orderId,
      userId,
      product
    });

    const response = await axiosPrivate2.patch(
      `/api/order/${orderId}/charge/${userId}/${shopId}`,
      product
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getStatusValues = async ({ signal }) => {
  try {
    const response = await axios.get('/api/order/status-val', {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listByShop = async ({ shopId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/orders/shop/${shopId}`, {
      signal
      // headers: { authorization: `Bearer ${accessToken2}` }
    });

    console.log({ response });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listByUser = async ({ userId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/orders/user/${userId}`, {
      signal
      // headers: { authorization: `Bearer ${accessToken2}` }
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
