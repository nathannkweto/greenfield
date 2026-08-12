import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { TERMS_DATA } from '../../data/academicsData';

export default function StudentAcademics() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const currentTermId = TERMS_DATA.find(term => term.isCurrent)?.id || false;
    const [expanded, setExpanded] = useState<string | false>(currentTermId);

    const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                        Academic Record
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        View your progress, courses, and access class materials by term.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {TERMS_DATA.map((term) => (
                        <Accordion
                            key={term.id}
                            expanded={expanded === term.id}
                            onChange={handleAccordionChange(term.id)}
                            variant="outlined"
                            sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, borderColor: term.isCurrent ? 'primary.main' : 'divider' }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontWeight: term.isCurrent ? 800 : 600 }}>{term.title}</Typography>
                                {term.isCurrent && <Chip label="Current" size="small" color="primary" sx={{ ml: 2, height: 24 }} />}
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: isMobile ? 1 : 2 }}>
                                {isMobile ? (
                                    /* MOBILE NATIVE LIST VIEW */
                                    <Stack spacing={2}>
                                        {term.courses.map((course) => (
                                            <Box key={course.id} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{course.code}</Typography>
                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{course.credits} Credits</Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ mb: 2 }}>{course.title}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    {course.grade !== '-' ? (
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Grade: {course.grade}</Typography>
                                                    ) : (
                                                        <Chip label="In Progress" size="small" />
                                                    )}
                                                    <Button size="small" endIcon={<InfoOutlinedIcon />} onClick={() => navigate(`course/${course.id}`)}>Details</Button>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    /* DESKTOP TABLE VIEW */
                                    <TableContainer>
                                        <Table>
                                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Course Title</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Credits</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Grade</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {term.courses.map((course) => (
                                                    <TableRow key={course.id} hover>
                                                        <TableCell>{course.code}</TableCell>
                                                        <TableCell>{course.title}</TableCell>
                                                        <TableCell align="center">{course.credits}</TableCell>
                                                        <TableCell align="center">{course.grade}</TableCell>
                                                        <TableCell align="right">
                                                            <Button onClick={() => navigate(`course/${course.id}`)}>Details</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}