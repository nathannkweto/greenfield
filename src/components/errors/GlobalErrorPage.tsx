import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button, Box, Typography, Container } from "@mui/material";
// Using the correct v9 icon name we fixed earlier!
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

export default function GlobalErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    // 1. Default fallback values for unexpected code crashes (500)
    let title = "Unexpected Error";
    let message = "Something went wrong on our end. Please try again later.";

    // 2. Explicitly check if it's a routing error (like a 404)
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = "404 - Page Not Found";
            message = "The page you are looking for doesn't exist or has been moved.";
        } else if (error.status === 401) {
            title = "401 - Unauthorized";
            message = "You don't have permission to access this resource.";
        }
    } else if (error instanceof Error) {
        // This catches normal JS code crashes during development
        message = error.message;
    }

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <ErrorOutlinedIcon color="error" sx={{ fontSize: 80 }} />

                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>                    {title}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {message}
                </Typography>

                <Button variant="contained" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </Box>
        </Container>
    );
}