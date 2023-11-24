import queryString from 'query-string';

import axios from '../axios';

export const readProduct = async ({ productId, signal }) => {
  try {
    const response = await axios.get(`/api/product/${productId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const createProduct = async ({
  shopId,
  productData,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.post(
      `/api/products/by/${shopId}`,
      productData,
      {
        headers: { authorization: `Bearer ${accessToken2}` }
      }
    );

    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateProduct = async ({
  shopId,
  productId,
  productData,
  accessToken2,
  axiosPrivate
}) => {
  try {
    const response = await axiosPrivate.patch(
      `/api/product/${shopId}/${productId}`,
      productData,
      {
        headers: { authorization: `Bearer ${accessToken2}` }
      }
    );

    return response.data;
  } catch (err) {
    return err;
  }
};

export const removeProduct = async ({
  accessToken2,
  axiosPrivate,
  productId,
  shopId
}) => {
  try {
    const response = await axiosPrivate.delete(
      `/api/product/${shopId}/${productId}`,
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

export const listLatest = async signal => {
  try {
    const response = await axios.get('/api/products/latest', {
      signal
    });

    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const listCategories = async signal => {
  try {
    const response = await axios.get('/api/products/categories', {
      signal
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const listRelated = async ({ productId, signal }) => {
  try {
    const response = await axios.get(`/api/products/related/${productId}`, {
      signal
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const listByShop = async ({ shopId, signal }) => {
  try {
    const response = await axios.get(`/api/products/by/${shopId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

export const list = async ({ search, category, signal }) => {
  try {
    const query = queryString.stringify({ search, category });

    console.log({ query });

    const response = await axios.get(`/api/products?${query}`, {
      signal
    });
    return response.data;
  } catch (err) {
    return err;
  }
};
