import axios from '../axios'

export const listByShop = async (params, signal) => {
  try {
    const response = await axios.get(`/api/products/by/${params.shopId}`, {
      signal
    })

    return response.data
  } catch(err) {
    // console.log(err)
    return err
  }
}
