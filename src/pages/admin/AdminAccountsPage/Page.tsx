import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Alert, Avatar, Box, Button, CircularProgress, Container, Dialog,
    DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

import { GET_ADMIN_ACCOUNTS } from './queries';
import { getAdmins } from '../../../api/generated';

export interface AdminNode {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    employeeNumber: string;
    department: string;
    position: string;
    createdAt?: string;
    updatedAt?: string;
    user: {
        id: string;
        email: string;
        phone?: string | null;
    };
}

interface AdminData {
    admins: {
        edges: Array<{ node: AdminNode }>;
    };
}

export default function AdminAccountsPage() {
    const { data, loading, error, refetch } = useQuery<AdminData>(GET_ADMIN_ACCOUNTS, {
        variables: { first: 100 },
        fetchPolicy: 'cache-and-network',
    });

    const [editing, setEditing] = useState<AdminNode | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Filters and Sorting
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'employeeNumber'>('name');

    // Dialog Form Values
    const [values, setValues] = useState({
        email: '',
        phone: '',
        firstName: '',
        middleName: '',
        lastName: '',
        employeeNumber: '',
        department: '',
        roleTitle: '',
    });

    const rawAdmins = useMemo<AdminNode[]>(() => {
        if (!data?.admins?.edges) return [];
        return data.admins.edges.map((edge) => edge.node);
    }, [data]);

    // Dynamic list of unique departments for filtering
    const departmentList = useMemo(() => {
        const departments = rawAdmins.map((admin) => admin.department).filter(Boolean);
        return Array.from(new Set(departments));
    }, [rawAdmins]);

    const processedAdmins = useMemo(() => {
        let result = [...rawAdmins];

        if (filterDepartment !== 'All') {
            result = result.filter((admin) => admin.department === filterDepartment);
        }

        result.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
                const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            }
            return a.employeeNumber.localeCompare(b.employeeNumber);
        });

        return result;
    }, [rawAdmins, filterDepartment, sortBy]);

    const openForm = (admin?: AdminNode) => {
        setEditing(admin ?? null);
        setValues(
            admin
                ? {
                    email: admin.user?.email ?? '',
                    phone: admin.user?.phone ?? '',
                    firstName: admin.firstName ?? '',
                    middleName: admin.middleName ?? '',
                    lastName: admin.lastName ?? '',
                    employeeNumber: admin.employeeNumber ?? '',
                    department: admin.department ?? '',
                    roleTitle: admin.position ?? '',
                }
                : {
                    email: '',
                    phone: '',
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    employeeNumber: '',
                    department: '',
                    roleTitle: '',
                }
        );
        setMessage(null);
        setOpen(true);
    };

    const save = async () => {
        if (!values.email || !values.firstName || !values.lastName || !values.employeeNumber || !values.department || !values.roleTitle) {
            setMessage('Please fill in all required fields (Email, First Name, Last Name, Employee Number, Department, and Position).');
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const api = getAdmins();
            const payload = {
                email: values.email,
                phone: values.phone || undefined,
                first_name: values.firstName,
                middle_name: values.middleName || undefined,
                last_name: values.lastName,
                employee_number: values.employeeNumber,
                department: values.department,
                position: values.roleTitle,
            };

            if (editing) {
                await api.postAdminsPublicIdEdit(editing.id, payload);
            } else {
                await api.postAdminsCreate(payload);
            }

            await refetch();
            setOpen(false);
        } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : 'Unable to save administrator.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Administrators</Typography>
                        <Typography color="text.secondary">Manage administrator profiles and department roles.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm()}>
                        Add administrator
                    </Button>
                </Box>

                {error && <Alert severity="error">{error.message}</Alert>}

                {/* Master Card Table Structure */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>

                    {/* Filters & Sorting Bar */}
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            gap: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <TextField
                            select
                            label="Department"
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 240 } }}
                        >
                            <MenuItem value="All">All Departments</MenuItem>
                            {departmentList.map((dept) => (
                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'employeeNumber')}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 200 }, ml: { sm: 'auto' } }}
                        >
                            <MenuItem value="name">Alphabetical</MenuItem>
                            <MenuItem value="employeeNumber">Employee Number</MenuItem>
                        </TextField>
                    </Box>

                    {/* Table View */}
                    {loading ? (
                        <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Administrator Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Employee No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Department & Position</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processedAdmins.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                                <Typography color="text.secondary">No administrators found.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        processedAdmins.map((admin) => (
                                            <TableRow key={admin.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 36, height: 36, backgroundColor: 'primary.light', color: 'primary.dark' }}>
                                                            <PersonIcon fontSize="small" />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                                {admin.lastName} {admin.firstName} {admin.middleName ?? ''}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                {admin.user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                                    {admin.employeeNumber}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {admin.position}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {admin.department}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => openForm(admin)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Add / Edit Dialog */}
                <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{editing ? 'Edit administrator' : 'Add administrator'}</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        {message && <Alert severity="error">{message}</Alert>}

                        <TextField
                            label="Email Address"
                            type="email"
                            value={values.email}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            required
                        />
                        <TextField
                            label="Phone Number"
                            value={values.phone}
                            onChange={(e) => setValues({ ...values, phone: e.target.value })}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                            <TextField
                                label="First Name"
                                value={values.firstName}
                                onChange={(e) => setValues({ ...values, firstName: e.target.value })}
                                required
                            />
                            <TextField
                                label="Middle Name"
                                value={values.middleName}
                                onChange={(e) => setValues({ ...values, middleName: e.target.value })}
                            />
                            <TextField
                                label="Last Name"
                                value={values.lastName}
                                onChange={(e) => setValues({ ...values, lastName: e.target.value })}
                                required
                            />
                        </Box>
                        <TextField
                            label="Employee Number"
                            value={values.employeeNumber}
                            onChange={(e) => setValues({ ...values, employeeNumber: e.target.value })}
                            required
                        />
                        <TextField
                            label="Department"
                            value={values.department}
                            onChange={(e) => setValues({ ...values, department: e.target.value })}
                            required
                        />
                        <TextField
                            label="Role Title / Position"
                            value={values.roleTitle}
                            onChange={(e) => setValues({ ...values, roleTitle: e.target.value })}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={save} variant="contained" disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}