import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { WarningAmber as WarningAmberIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export default function PortalErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    // Default to the generic code crash error
    let title = "An Error Occurred";
    let message = "Something went wrong. Please try again later.";

    // Natively intercept the 404 we throw from the router
    if (isRouteErrorResponse(error) && error.status === 404) {
        title = "Page Not Found";
        message = "This page does not exist.";
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', p: 2 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'error.light',
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.05)' : 'rgba(211, 47, 47, 0.02)',
                    borderRadius: 3
                }}
            >
                <WarningAmberIcon sx={{ fontSize: 48, color: 'error.main', mb: 1.5 }} />

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                    {title}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {message}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 600 }}
                >
                    Go Back
                </Button>
            </Paper>
        </Box>
    );
}