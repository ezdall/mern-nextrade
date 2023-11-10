import axios from '../axios';

export const readProduct = async (params, signal) => {
  try {
    const response = await axios.get(`/api/product/${params.productId}`, {
      signal
    });

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
    // console.log(err)
    return err;
  }
};

export const listRelated = async (params, signal) => {
  try {
    const response = await axios.get(
      `/api/products/related/${params.productId}`,
      {
        signal
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const listByShop = async (params, signal) => {
  try {
    const response = await axios.get(`/api/products/by/${params.shopId}`, {
      signal
    });

    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

export const list = async (params, signal) => {
  // const query = queryString.stringify(params)

  try {
    const response = await axios.get('/api/products', {
      signal
    });
    return response.data;
  } catch (err) {
    // console.log(err)
    return err;
  }
};
