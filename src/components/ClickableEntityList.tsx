import React from 'react';
import { Paper, List, ListItem, ListItemText, ListItemButton, IconButton, Divider, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

interface EntityItem {
    id: string;
    publicId?: string;
    primary: string;
    secondary?: string;
    targetUrl: string;
}

interface ClickableEntityListProps {
    items: EntityItem[];
    emptyMessage?: string;
}

export function ClickableEntityList({ items, emptyMessage = "No items found." }: ClickableEntityListProps) {
    const navigate = useNavigate();

    if (!items.length) {
        return <Typography color="text.secondary" sx={{ p: 2 }}>{emptyMessage}</Typography>;
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
                {items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            disablePadding
                            secondaryAction={
                                <IconButton edge="end" size="small" onClick={() => navigate(item.targetUrl)}>
                                    <ChevronRightIcon />
                                </IconButton>
                            }
                        >
                            <ListItemButton
                                onClick={() => navigate(item.targetUrl)}
                                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                                <ListItemText
                                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.primary}</Typography>}
                                    secondary={item.secondary}
                                />
                            </ListItemButton>
                        </ListItem>
                        {idx < items.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}