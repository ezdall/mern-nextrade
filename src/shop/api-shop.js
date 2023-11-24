import axios from '../axios';

export const createShop = ({
  userId,
  shopData,
  accessToken2,
  axiosPrivate
}) => {
  return axiosPrivate
    .post(`/api/shops/by/${userId}`, shopData, {
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

export const readShop = async ({ shopId, signal }) => {
  try {
    const response = await axios.get(`/api/shop/${shopId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateShop = async ({
  shopId,
  shopData,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/shops/${shopId}`,
      shopData,
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

export const removeShop = async ({ shopId, accessToken2, axiosPrivate }) => {
  try {
    const response = await axiosPrivate.delete(`/api/shops/${shopId}`, {
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

export const listByOwner = async ({
  userId,
  signal,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.get(`/api/shops/by/${userId}`, {
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
