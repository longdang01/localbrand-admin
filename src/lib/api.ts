import axios from 'axios';
import { BASE_URL } from '@/constants/config';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            (error.response.status === 422 &&
                error?.response?.data?.detail === 'Signature has expired') ||
            error.response.status === 401
        ) {
            localStorage.clear();
            location.reload();
        }
        return Promise.reject(error);
    },
);
