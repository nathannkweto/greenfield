import { Box, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface LedgerFiltersProps {
    currentTab: 'ALL' | 'CHARGES' | 'PAYMENTS';
    onTabChange: (tab: 'ALL' | 'CHARGES' | 'PAYMENTS') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function LedgerFilters({ currentTab, onTabChange, searchQuery, onSearchChange }: LedgerFiltersProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
                pb: 2,
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Tabs
                value={currentTab}
                onChange={(_, val) => onTabChange(val)}
                indicatorColor="primary"
                textColor="primary"
                sx={{
                    minHeight: 40,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        minHeight: 40,
                        px: 2,
                    },
                }}
            >
                <Tab label="All Activity" value="ALL" />
                <Tab label="Billed Charges" value="CHARGES" />
                <Tab label="Payments Made" value="PAYMENTS" />
            </Tabs>

            <TextField
                size="small"
                placeholder="Search description or reference..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ minWidth: { xs: '100%', sm: 280 } }}
            />
        </Box>
    );
}