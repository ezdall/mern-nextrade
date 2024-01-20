import queryString from 'query-string';

import axios from '../axios';

export const readProduct = async ({ productId, signal }) => {
  try {
    const response = await axios.get(`/api/product/${productId}`, {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createProduct = async ({ shopId, productData, axiosPrivate2 }) => {
  try {
    const response = await axiosPrivate2.post(
      `/api/products/by/${shopId}`,
      productData
    );

    return response.data;
  } catch (error) {
    console.log(error.data);
    return error;
  }
};

export const updateProduct = async ({
  productData,
  shopId,
  productId,
  accessToken2,
  axiosPrivate2
}) => {
  try {
    const response = await axiosPrivate2.patch(
      `/api/product/${shopId}/${productId}`,
      productData
    );

    return response.data;
  } catch (error) {
    console.log(error.data);

    return error;
  }
};

export const removeProduct = async ({
  accessToken2,
  axiosPrivate2,
  productId,
  shopId
}) => {
  try {
    const response = await axiosPrivate2.delete(
      `/api/product/${shopId}/${productId}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listLatest = async ({ signal }) => {
  try {
    const response = await axios.get('/api/products/latest', {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listCategories = async ({ signal }) => {
  try {
    const response = await axios.get('/api/products/categories', {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const listRelated = async ({ signal, productId }) => {
  try {
    const response = await axios.get(`/api/products/related/${productId}`, {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const listByShop = async ({ shopId, signal }) => {
  try {
    const response = await axios.get(`/api/products/by/${shopId}`, {
      signal
    });

    return response.data;
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const list = async ({ search, category, signal }) => {
  try {
    const query = queryString.stringify({ search, category });

    const response = await axios.get(`/api/products?${query}`, { signal });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
