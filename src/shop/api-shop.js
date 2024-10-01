import axios from '../axios';

export const createShop = ({ userId, shopData, axiosPrivate2 }) => {
  return axiosPrivate2
    .post(`/api/shops/by/${userId}`, shopData)
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const readShop = async ({ shopId, signal }) => {
  try {
    const response = await axios.get(`/api/shop/${shopId}`, { signal });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const removeShop = async ({ shopId, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.delete(`api/shops/${shopId}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateShop = async ({ shopId, shopData, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.patch(
      `/api/shops/${shopId}`,
      shopData
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const list = async ({ signal }) => {
  try {
    const response = await axios.get('/api/shops', {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listByOwner = async ({ userId, signal, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.get(`/api/shops/by/${userId}`, {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
