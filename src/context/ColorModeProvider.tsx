import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline, type PaletteMode } from "@mui/material";
import { getDesignTokens } from "../theme";
import { ColorModeContext } from "./ColorModeContext";

interface ColorModeProviderProps {
    children: ReactNode;
}

export default function ColorModeProvider({ children }: ColorModeProviderProps) {
    const [mode, setMode] = useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}