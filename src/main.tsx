import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { RouterProvider } from 'react-router-dom';

import { client } from './apolloClient';
import ColorModeProvider from './context/ColorModeProvider';
import { router } from './router';
import './index.css';
import { AuthProvider } from "./context/AuthProvider";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <ColorModeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ColorModeProvider>
        </ApolloProvider>
    </StrictMode>
);
