import axios from '../axios'

import auth from '../auth/auth-helper'

const { accessToken } = auth.isAuthenticated()

export const createOrder = async (params, order, token) => {
  try {
    const response = await axios.post(`/api/orders/${params.userId}`, { order, token }, {
        headers: {
          authorization: `Bearer ${accessToken}`
        },
      })
      return response.data
    }catch(err) {
      // console.log(err)
      return err
    }
}



