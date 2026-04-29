/* // axiosInterceptorInstance.js

import { useAuth } from '@/src/providers/AuthContext';
import axios, { AxiosError } from 'axios';
//import { cookies } from 'next/headers';
const axiosInterceptorInstance = axios.create({
    //baseURL: 'https://your-api-base-url.com/', // Replace with your API base URL
});

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
    async (config) => {
        // Modify the request config here (add headers, authentication tokens)
        const cookieStore = await cookies();
        const accessToken = JSON.parse(cookieStore.get('accessToken')!.value);

        // If token is present, add it to request's Authorization Header
        if (accessToken) {
            if (config.headers) config.headers.token = accessToken;
        }
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
    (response) => {
        // Modify the response data here

        return response;
    },
    (error: AxiosError) => {
        console.log('axiosInterceptorInstance.interceptors.response ', error.status)
        const { signOut } = useAuth()
        switch (error.status) {
            case 401:
                console.log('401')
                signOut()
                break;

            default:
                break;
        }
        // Handle response errors here
        return Promise.reject(error);
    }
);

export default axiosInterceptorInstance; */

