import axios from 'axios';

const BASE_URL = 'http://localhost:3000'

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
});

export const handleAxiosError=(error, setErrMsg) => {
        const { response } = error

        if(!response){
            console.log({error})
            setErrMsg('No Server Response');
            // return;
        }

        // axios error
        if(response.status === 400){
            const axErrMsg = response.data.error

            console.log({error})

            setErrMsg(axErrMsg)
            // return;
        }

        if(response.status === 401){
            const axErrMsg = response.data.error

            console.log({error})

            setErrMsg(axErrMsg)
            // return;
        }

// return
        // axios + mongoose error
        // error.response.data.error.code === 11000
        // error.response.data.error.keyValue.email === '...@...'

}

