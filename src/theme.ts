import type { PaletteMode, ThemeOptions } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: mode === 'light' ? '#2c318d' : '#7986cb',
        },
        background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    scrollBehavior: 'smooth',
                },
                /* Firefox Custom Scrollbar */
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: mode === 'light' ? '#cbd5e1 transparent' : '#334155 transparent',
                },
                /* WebKit (Chrome, Safari, Edge) Custom Scrollbar */
                '::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '::-webkit-scrollbar-thumb': {
                    backgroundColor: mode === 'light' ? '#cbd5e1' : '#334155',
                    borderRadius: '20px',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#2c318d' : '#7986cb',
                    },
                },
                /* Native View Transition Keyframes */
                '::view-transition-old(root)': {
                    animation: '120ms cubic-bezier(0.4, 0, 1, 1) both fade-out',
                },
                '::view-transition-new(root)': {
                    animation: '210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in',
                },
                '@keyframes fade-out': {
                    from: { opacity: 1, transform: 'scale(1)' },
                    to: { opacity: 0, transform: 'scale(0.98)' },
                },
                '@keyframes fade-in': {
                    from: { opacity: 0, transform: 'scale(1.01)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
                },
            },
        },
    },
});