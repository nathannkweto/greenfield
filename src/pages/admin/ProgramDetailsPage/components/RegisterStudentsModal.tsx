import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Tabs,
    Tab,
    Alert,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    IconButton,
    Button,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableChartIcon from '@mui/icons-material/TableChart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DownloadIcon from '@mui/icons-material/Download';
import type {Program, StudentRegisterItem, BatchStudentRegisterResponse} from '../types';

interface RegisterStudentsModalProps {
    open: boolean;
    onClose: () => void;
    program: Program;
    tab: number;
    setTab: (tab: number) => void;
    studentRows: StudentRegisterItem[];
    csvFile: File | null;
    setCsvFile: (file: File | null) => void;
    submitting: boolean;
    uploadResult: BatchStudentRegisterResponse['data'] | null;
    uploadError: string | null;
    onAddRow: () => void;
    onRemoveRow: (index: number) => void;
    onRowChange: <K extends keyof StudentRegisterItem>(
        index: number,
        field: K,
        value: StudentRegisterItem[K]
    ) => void;
    onDownloadTemplate: () => void;
    onSubmitBatch: () => void;
    onSubmitCsv: () => void;
}

export default function RegisterStudentsModal({
                                                  open,
                                                  onClose,
                                                  program,
                                                  tab,
                                                  setTab,
                                                  studentRows,
                                                  csvFile,
                                                  setCsvFile,
                                                  submitting,
                                                  uploadResult,
                                                  uploadError,
                                                  onAddRow,
                                                  onRemoveRow,
                                                  onRowChange,
                                                  onDownloadTemplate,
                                                  onSubmitBatch,
                                                  onSubmitCsv,
                                              }: RegisterStudentsModalProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
                    Register Students to {program.code || program.title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, newValue: number) => setTab(newValue)}
                    >
                        <Tab icon={<TableChartIcon />} iconPosition="start" label="Form Table Method" />
                        <Tab icon={<UploadFileIcon />} iconPosition="start" label="CSV File Import" />
                    </Tabs>
                </Box>

                {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {uploadError}
                    </Alert>
                )}

                {uploadResult && (
                    <Alert
                        severity={uploadResult.failed_count > 0 ? 'warning' : 'success'}
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Batch Processing Summary:
                        </Typography>
                        <Typography variant="body2">
                            Processed: {uploadResult.total_processed} | Successful: {uploadResult.successful_count} | Failed: {uploadResult.failed_count}
                        </Typography>
                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                            <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                                {uploadResult.errors.map((err, idx) => (
                                    <li key={idx}>
                                        <Typography variant="caption">
                                            Row {err.row} {err.email ? `(${err.email})` : ''}: {err.message}
                                        </Typography>
                                    </li>
                                ))}
                            </Box>
                        )}
                    </Alert>
                )}

                {/* TAB 0: Dynamic Form Table */}
                {tab === 0 && (
                    <Box sx={{ width: '100%' }}>
                        <TableContainer
                            component={Paper}
                            variant="outlined"
                            sx={{ maxHeight: 480, overflowX: 'auto', overflowY: 'auto' }}
                        >
                            <Table size="small" stickyHeader sx={{ minWidth: 3200 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>First Name *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Middle Names</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Last Name *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 220 }}>Email *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Phone *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>DOB</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 220 }}>Address</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Emergency Contact</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Sex *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Marital Status *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Nationality</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>NRC Number</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Passport Number</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Application No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Admission No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Student No.</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Intake *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>Study Mode *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Registration Date *</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>Current Year</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Credits Earned</TableCell>
                                        <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>CGPA</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, minWidth: 80 }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentRows.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.first_name} onChange={(e) => onRowChange(index, 'first_name', e.target.value)} placeholder="Jane" required />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.middle_names || ''} onChange={(e) => onRowChange(index, 'middle_names', e.target.value)} placeholder="Chileshe" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.last_name} onChange={(e) => onRowChange(index, 'last_name', e.target.value)} placeholder="Phiri" required />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" type="email" value={row.email} onChange={(e) => onRowChange(index, 'email', e.target.value)} placeholder="jane@example.com" required />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.phone} onChange={(e) => onRowChange(index, 'phone', e.target.value)} placeholder="+260971234567" required />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth type="date" size="small" value={row.dob || ''} onChange={(e) => onRowChange(index, 'dob', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.address || ''} onChange={(e) => onRowChange(index, 'address', e.target.value)} placeholder="123 Great East Rd" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.emergency_contact || ''} onChange={(e) => onRowChange(index, 'emergency_contact', e.target.value)} placeholder="+260978888888" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField select fullWidth size="small" value={row.sex} onChange={(e) => onRowChange(index, 'sex', e.target.value as StudentRegisterItem['sex'])}>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="male">Male</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField select fullWidth size="small" value={row.marital_status} onChange={(e) => onRowChange(index, 'marital_status', e.target.value as StudentRegisterItem['marital_status'])}>
                                                    <MenuItem value="single">Single</MenuItem>
                                                    <MenuItem value="married">Married</MenuItem>
                                                    <MenuItem value="widow">Widow</MenuItem>
                                                    <MenuItem value="divorced">Divorced</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.nationality || 'Zambian'} onChange={(e) => onRowChange(index, 'nationality', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.nrc_number || ''} onChange={(e) => onRowChange(index, 'nrc_number', e.target.value)} placeholder="123456/10/1" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.passport_number || ''} onChange={(e) => onRowChange(index, 'passport_number', e.target.value)} placeholder="Z1234567" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.application_number || ''} onChange={(e) => onRowChange(index, 'application_number', e.target.value)} placeholder="APP2026001" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.admission_number || ''} onChange={(e) => onRowChange(index, 'admission_number', e.target.value)} placeholder="ADM2026001" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField fullWidth size="small" value={row.student_number || ''} onChange={(e) => onRowChange(index, 'student_number', e.target.value)} placeholder="STU2026001" />
                                            </TableCell>
                                            <TableCell>
                                                <TextField select fullWidth size="small" value={row.intake} onChange={(e) => onRowChange(index, 'intake', e.target.value as StudentRegisterItem['intake'])}>
                                                    <MenuItem value="January">January</MenuItem>
                                                    <MenuItem value="May">May</MenuItem>
                                                    <MenuItem value="September">September</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField select fullWidth size="small" value={row.study_mode} onChange={(e) => onRowChange(index, 'study_mode', e.target.value as StudentRegisterItem['study_mode'])}>
                                                    <MenuItem value="full_time">Full Time</MenuItem>
                                                    <MenuItem value="part_time">Part Time</MenuItem>
                                                    <MenuItem value="distance_learning">Distance</MenuItem>
                                                    <MenuItem value="online">Online</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField type="date" fullWidth size="small" value={row.registration_date} onChange={(e) => onRowChange(index, 'registration_date', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField type="number" fullWidth size="small" value={row.current_year ?? 1} onChange={(e) => onRowChange(index, 'current_year', parseInt(e.target.value, 10) || 1)} slotProps={{ htmlInput: { min: 1 } }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField type="number" fullWidth size="small" value={row.credits_earned ?? 0} onChange={(e) => onRowChange(index, 'credits_earned', parseInt(e.target.value, 10) || 0)} slotProps={{ htmlInput: { min: 0 } }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField type="number" fullWidth size="small" value={row.cgpa ?? 0.00} onChange={(e) => onRowChange(index, 'cgpa', parseFloat(e.target.value) || 0.00)} slotProps={{ htmlInput: { step: '0.01', min: 0, max: 5 } }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" color="error" onClick={() => onRemoveRow(index)} disabled={studentRows.length === 1}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                            <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={onAddRow}>
                                Add Student Row
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* TAB 1: CSV File Import */}
                {tab === 1 && (
                    <Box sx={{ py: 3, px: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Box
                            sx={{
                                width: '100%',
                                border: '2px dashed',
                                borderColor: csvFile ? 'primary.main' : 'divider',
                                borderRadius: 3,
                                p: 5,
                                textAlign: 'center',
                                backgroundColor: csvFile ? 'action.hover' : 'background.default',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'action.hover',
                                },
                            }}
                            component="label"
                        >
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setCsvFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <CloudUploadIcon sx={{ fontSize: 56, color: csvFile ? 'primary.main' : 'text.secondary', mb: 1.5 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {csvFile ? csvFile.name : 'Click to select or drop CSV spreadsheet here'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Supports standard .csv format up to 10MB'}
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={onDownloadTemplate}
                            sx={{ borderRadius: 2 }}
                        >
                            Download CSV Template
                        </Button>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose}>Cancel</Button>
                {tab === 0 ? (
                    <Button
                        variant="contained"
                        onClick={onSubmitBatch}
                        disabled={submitting || studentRows.length === 0}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <GroupAddIcon />}
                    >
                        {submitting ? 'Registering...' : `Submit ${studentRows.length} Student(s)`}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSubmitCsv}
                        disabled={submitting || !csvFile}
                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    >
                        {submitting ? 'Uploading...' : 'Import CSV File'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}