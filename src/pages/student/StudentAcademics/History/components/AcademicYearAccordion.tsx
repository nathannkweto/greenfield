import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type {YearlyAcademicRecord} from '../types';
import { CourseEnrollmentRow } from './CourseEnrollmentRow';

interface AcademicYearAccordionProps {
    record: YearlyAcademicRecord;
    defaultExpanded?: boolean;
}

export function AcademicYearAccordion({ record, defaultExpanded = false }: AcademicYearAccordionProps) {
    const studyYearLabel =
        record.studyYears.length > 0
            ? record.studyYears.map((y) => `Year ${y} of Study`).join(', ')
            : 'No Active Study Level';

    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            variant="outlined"
            sx={{
                borderRadius: '12px !important',
                mb: 2,
                overflow: 'hidden',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    px: 2.5,
                    py: 1,
                    backgroundColor: 'action.hover',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        pr: 2,
                        flexWrap: 'wrap',
                        gap: 1.5,
                    }}
                >
                    {/* Left: Calendar Year & Study Year */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                display: 'flex',
                            }}
                        >
                            <CalendarTodayIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>
                                {record.calendarYear} Calendar Year
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                {studyYearLabel} • (College Year {record.yearsInCollege})
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right: Enrolled Stats badges */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip
                            label={`${record.enrollments.length} ${record.enrollments.length === 1 ? 'Course' : 'Courses'}`}
                            size="small"
                            color="default"
                            sx={{ fontWeight: 700 }}
                        />
                        <Chip
                            label={`${record.totalCredits} Credits`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>
                </Box>
            </AccordionSummary>

            <Divider />

            <AccordionDetails sx={{ p: 0 }}>
                {record.enrollments.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No course enrollments were recorded during the {record.calendarYear} academic period.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Course Code</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Course Title</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800 }}>
                                        Study Level
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800 }}>
                                        Credits
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800 }}>
                                        Enrolled Date
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800 }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                                        Grade
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {record.enrollments.map((enrollment) => (
                                    <CourseEnrollmentRow key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </AccordionDetails>
        </Accordion>
    );
}