import '@mui/material/Typography';

declare module '@mui/material/Typography' {
    interface TypographyOwnProps {
        /** Compatibility for existing MUI typography declarations in this project. */
        fontWeight?: number | string;
    }
}
