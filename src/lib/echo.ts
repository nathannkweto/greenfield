// lib/echo.ts
import Echo from 'laravel-echo';
import Pusher, { type ChannelAuthorizationCallback } from 'pusher-js';
import { AXIOS_INSTANCE, getRootUrl } from '../api/axios-instance';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

window.Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

export const getEcho = (): Echo<any> => {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            authorizer: (channel: { name: string }) => ({
                authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
                    AXIOS_INSTANCE.post(`${getRootUrl()}/broadcasting/auth`, {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                        .then((response) => callback(null, response.data))
                        .catch((error: Error) => callback(error, null));
                },
            }),
        });
    }
    return echoInstance;
};