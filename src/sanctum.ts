import Axios from 'axios';
import { getRootUrl } from './api/axios-instance';

const SANCTUM_URL = import.meta.env?.VITE_SANCTUM_URL || getRootUrl();

export const sanctumClient = Axios.create({
    baseURL: SANCTUM_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

export const refreshCsrfToken = async (): Promise<void> => {
    try {
        await sanctumClient.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
    }
};
