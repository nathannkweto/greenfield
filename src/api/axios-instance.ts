import Axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

// Declare process safely to avoid requiring @types/node
declare const process: { env: Record<string, string | undefined> } | undefined;

const getBaseUrl = (): string => {
    // Vite support
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL as string;
    }
    // Next.js / CRA support
    if (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    return 'http://localhost:8000/api/v1';
};

export const AXIOS_INSTANCE = Axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true, // Required for HttpOnly session cookies
    withXSRFToken: true,   // Automatically sends X-XSRF-TOKEN header from XSRF-TOKEN cookie
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Custom instance function expected by Orval
export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig
): Promise<T> => {
    const source = Axios.CancelToken.source();

    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // Cast the promise type cleanly to attach cancel without using @ts-ignore
    const cancellablePromise = promise as Promise<T> & { cancel: () => void };
    cancellablePromise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return cancellablePromise;
};

// Exported for Orval error typing compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ErrorType<E = unknown> = AxiosError<E>;