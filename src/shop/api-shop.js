import axios from '../axios'

// obj:params, str:accesstoken, shop:shopData
export const createShop = (params, shop, accessToken) =>{
	return axios.post(`/api/shops/by/${params?.userId}`, shop, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	})
	.then(resp => {
		// console.log(resp)
		const {status, data} = resp
      
    if(status === (200 || 201)){
      throw Error('error @createShop')
    }

    return data;

	})
	.catch(err => console.log(err))
}

export const listByOwner = async (params, signal, accessToken) => {
  try {
    const response = await axios.get(`/api/shops/by/${params.userId}`, {
      signal,
      headers: {
        authorization:  `Bearer ${accessToken}`
      }
    })

    return response.data
  } catch(err){
    console.log({err})
   return err

  }
}
