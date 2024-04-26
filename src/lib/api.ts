import axios from 'axios';
import { BASE_URL } from '@/constants/config';
import { LOGIN_PATH } from '@/paths';

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
            (error.response.status === 422 && error?.response?.data?.detail === 'Signature has expired') ||
            error?.response?.data?.detail === 'Only access tokens are allowed' ||
            error.response.status === 401 ||
            error.response.status === 403
        ) {
            localStorage.clear();
            location.reload();
            if (!window.location.pathname.includes(LOGIN_PATH)) {
                window.open(LOGIN_PATH, '_parent');
            }
        }
        return Promise.reject(error);
    },
);
