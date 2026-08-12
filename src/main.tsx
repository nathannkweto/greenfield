import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './apolloClient'; // Path to your Apollo configuration
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ColorModeProvider from './context/ColorModeProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <ColorModeProvider>
                <RouterProvider router={router} />
            </ColorModeProvider>
        </ApolloProvider>
    </StrictMode>
);