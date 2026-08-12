import type {PaletteMode} from '@mui/material';

// Instead of createTheme, we export the design tokens
export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            // Lighter green in dark mode for better contrast
            main: mode === 'light' ? '#2c318d' : '#7986cb',
        },
        background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
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