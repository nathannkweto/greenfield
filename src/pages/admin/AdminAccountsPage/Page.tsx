import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { getAdmins } from '../../../api/generated';
import { GET_ADMIN_ACCOUNTS } from './queries';

interface AdminNode { id: string; employeeNumber: string; department: string; position: string; user: { id: string; firstName: string; lastName: string; email: string } }
interface AdminData { admins: { edges: Array<{ node: AdminNode }> } }

export default function AdminAccountsPage() {
    const { data, loading, error, refetch } = useQuery<AdminData>(GET_ADMIN_ACCOUNTS, { variables: { first: 100 } });
    const [editing, setEditing] = useState<AdminNode | null>(null);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [values, setValues] = useState({ userId: '', employeeNumber: '', roleTitle: '' });
    const openForm = (admin?: AdminNode) => { setEditing(admin ?? null); setValues(admin ? { userId: admin.user.id, employeeNumber: admin.employeeNumber, roleTitle: admin.position } : { userId: '', employeeNumber: '', roleTitle: '' }); setOpen(true); };
    const save = async () => {
        if (!values.userId || !values.employeeNumber || !values.roleTitle) { setMessage('User ID, employee number, and role title are required.'); return; }
        setSaving(true); setMessage(null);
        try {
            const api = getAdmins();
            const payload = { user_public_id: values.userId, employee_number: values.employeeNumber, role_title: values.roleTitle };
            if (editing) await api.postAdminsPublicIdEdit(editing.id, payload); else await api.postAdminsCreate(payload);
            await refetch(); setOpen(false);
        } catch (requestError) { setMessage(requestError instanceof Error ? requestError.message : 'Unable to save administrator.'); } finally { setSaving(false); }
    };
    return <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: 4 }}><Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}><Box><Typography variant="h4" fontWeight={800}>Administrators</Typography><Typography color="text.secondary">Manage administrator profiles.</Typography></Box><Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm()}>Add administrator</Button></Box>
        {error && <Alert severity="error">{error.message}</Alert>}
        <Paper variant="outlined">{loading ? <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box> : <List>{data?.admins.edges.map(({ node }) => <ListItem key={node.id} secondaryAction={<Button startIcon={<EditIcon />} onClick={() => openForm(node)}>Edit</Button>}><ListItemText primary={`${node.user.firstName} ${node.user.lastName}`} secondary={`${node.employeeNumber} · ${node.position} · ${node.user.email}`} /></ListItem>)}</List>}</Paper>
        <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>{editing ? 'Edit administrator' : 'Add administrator'}</DialogTitle><DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
            {message && <Alert severity="error">{message}</Alert>}<TextField label="User public ID" value={values.userId} onChange={(event) => setValues({ ...values, userId: event.target.value })} required /><TextField label="Employee number" value={values.employeeNumber} onChange={(event) => setValues({ ...values, employeeNumber: event.target.value })} required /><TextField label="Role title" value={values.roleTitle} onChange={(event) => setValues({ ...values, roleTitle: event.target.value })} required />
        </DialogContent><DialogActions><Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button><Button onClick={save} variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></DialogActions></Dialog>
    </Container></Box>;
}
