'use client';

import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "./api";
import axios from "axios";


const AxiosInterceptorProvider = ({ children }) => {
    const { user, signOut } = useAuth(); // Access current context values

    useEffect(() => {
        // Request Interceptor: Adds the auth token to outgoing requests
        const requestInterceptor = API.interceptors.request.use(
            (config) => {
                /* if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
                } */
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor: Handles global errors (e.g., 401 Unauthorized)
        const responseInterceptor = API.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                // Check for 401 error and ensure it's not a retry attempt or the refresh call itself
                if (error.response.status === 401 && !originalRequest._retry) {
                    console.log('Ejecutar Refresh')
                    originalRequest._retry = true; // Mark as retry attempt to prevent infinite loops

                    try {
                        // Attempt to refresh the token using a separate, non-intercepted axios instance or the main one with a flag
                        const response = await axios.post('api/auth/refresh', {}); // Use a separate axios instance if necessary

                        console.log('Ejecutar Refresh response ', response)
                        // Retry the original request with the new token
                        //originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return API(originalRequest);

                    } catch (refreshError) {
                        console.log('Ejecutar refreshError  ',refreshError)
                        // Refresh failed, force logout
                        signOut();
                        // Redirect to login page if desired (can use navigate hook here)
                        //window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                /* if (error.response?.status === 401) {
                    // If 401, sign out the user and clear the context state
                    signOut();
                    // You could also implement token refresh logic here
                } */
                return Promise.reject(error);
            }
        );

        // Cleanup function to eject interceptors when the component unmounts or dependencies change
        return () => {
            API.interceptors.request.eject(requestInterceptor);
            API.interceptors.response.eject(responseInterceptor);
        };
    }, [user, signOut]); // Reruns useEffect if token or signOut changes

    return children;
};

export default AxiosInterceptorProvider;