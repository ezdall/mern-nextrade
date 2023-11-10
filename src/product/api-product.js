import axios from '../axios';

import auth from '../auth/auth-helper';

const { accessToken } = auth.isAuthenticated()

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

export const createProduct = async (params, product) => {
  try {
    const response = await axios.post(`/api/products/by/${params.shopId}`,
      product, { 
        headers: { authorization:`Bearer ${accessToken}` }
      }
    );

    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateProduct = async (params, product) => {
  try {
    const response = await axios.patch(`/api/product/${params.shopId}/${params.productId}`,
      product, { 
        headers: { authorization:`Bearer ${accessToken}` }
      }
    );

    return response.data;
  } catch (err) {
    return err;
  }
};

export const removeProduct = async (params) => {
  try {
    const response = await axios.delete(`/api/product/${params.shopId}/${params.productId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch(err) {
    return err
  }
}


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
