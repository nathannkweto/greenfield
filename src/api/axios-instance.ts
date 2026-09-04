import Axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

declare const process: { env: Record<string, string | undefined> } | undefined;

/**
 * Gets the root origin URL strictly from environment variables (Vite or Node process env).
 */
export const getRootUrl = (): string => {
    const url =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
        (typeof process !== 'undefined' && (process.env?.VITE_API_BASE_URL || process.env?.BASE_URL)) ||
        '';

    // Strip trailing /api/v1 or trailing slash if present to isolate root host
    return url.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
};

export const getApiBaseUrl = (): string => {
    const root = getRootUrl();
    return root ? `${root}/api/v1` : '/api/v1';
};

export const AXIOS_INSTANCE = Axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,  // Required for HttpOnly session cookies
    withXSRFToken: true,   // Automatically sends X-XSRF-TOKEN header from XSRF-TOKEN cookie
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Forces Laravel to return JSON on errors
    },
});

const ROOT_AXIOS_INSTANCE = Axios.create({
    baseURL: getRootUrl(),
    withCredentials: true,
    withXSRFToken: true,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

// Response Interceptor: Route user to login if session expires (401/419)
AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 419) {
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Custom instance function expected by Orval
export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig
): Promise<T> => {
    const source = Axios.CancelToken.source();

    const instance = config.url === '/sanctum/csrf-cookie' ? ROOT_AXIOS_INSTANCE : AXIOS_INSTANCE;
    const promise = instance({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    const cancellablePromise = promise as Promise<T> & { cancel: () => void };
    cancellablePromise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return cancellablePromise;
};

export type ErrorType<E = unknown> = AxiosError<E>;