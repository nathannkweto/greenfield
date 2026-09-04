import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link as MuiLink } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backUrl?: string;
    backLabel?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backUrl, backLabel, actionLabel, onAction, actionIcon }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <Box sx={{ mb: 4 }}>
            {backUrl && (
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(backUrl)}
                    sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
                >
                    {backLabel || 'Back'}
                </Button>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {actionLabel && onAction && (
                    <Button variant="contained" disableElevation startIcon={actionIcon} onClick={onAction} sx={{ borderRadius: 2 }}>
                        {actionLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
}