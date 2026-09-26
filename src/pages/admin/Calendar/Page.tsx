import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Tabs,
    Tab,
    Chip,
    Alert,
    AlertTitle,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import GridViewIcon from '@mui/icons-material/GridView';
import TableChartIcon from '@mui/icons-material/TableChart';

import { GET_ACADEMIC_CALENDAR } from './queries';
import type { AcademicYear } from './types';
import { sortAcademicYears } from './helpers';

import {
    MacroGanttCard,
    AgendaView,
    CalendarGridView,
    DataTableView,
    AcademicYearWizardModal,
    AddTermModal,
    AddEventModal,
} from './components';

interface AcademicCalendarQueryResponse {
    academicYears: AcademicYear[];
}

export default function AcademicCalendarPage() {
    const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'agenda' | 'grid' | 'table'>('agenda');

    // Modals state
    const [isYearWizardOpen, setIsYearWizardOpen] = useState(false);
    const [isTermModalOpen, setIsTermModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    // Selected date state for interactive grid clicks
    const [selectedGridDate, setSelectedGridDate] = useState<string>('');
    const [currentGridMonth, setCurrentGridMonth] = useState<Date>(new Date());

    const { loading, error, data } = useQuery<AcademicCalendarQueryResponse>(GET_ACADEMIC_CALENDAR);

    const academicYears = useMemo(() => {
        return sortAcademicYears(data?.academicYears || []);
    }, [data]);

    const currentAcademicYear = academicYears[selectedYearIndex];

    const currentTerms = useMemo(() => {
        if (!currentAcademicYear) return [];
        return currentAcademicYear.terms || currentAcademicYear.academic_terms || [];
    }, [currentAcademicYear]);

    const currentEvents = useMemo(() => {
        if (!currentAcademicYear) return [];
        return currentAcademicYear.events || currentAcademicYear.academic_events || [];
    }, [currentAcademicYear]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">
                    <AlertTitle>GraphQL Error</AlertTitle>
                    {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
            {/* Header & Main Actions */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Academic Calendar
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Configure academic terms, session boundaries, and key institutional milestones
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setIsYearWizardOpen(true)}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        New Academic Year
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DateRangeIcon />}
                        onClick={() => setIsTermModalOpen(true)}
                        disabled={!currentAcademicYear}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        Add Term
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EventIcon />}
                        onClick={() => {
                            setSelectedGridDate('');
                            setIsEventModalOpen(true);
                        }}
                        disabled={!currentAcademicYear}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        Add Event
                    </Button>
                </Box>
            </Box>

            {!currentAcademicYear ? (
                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        No Academic Years Configured
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsYearWizardOpen(true)}>
                        Create First Academic Year
                    </Button>
                </Paper>
            ) : (
                <>
                    {/* Academic Year Selector Bar */}
                    <Paper variant="outlined" sx={{ borderRadius: 3, mb: 3, p: 1, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mr: 2 }}>
                                ACADEMIC YEAR SCOPE
                            </Typography>
                            <Tabs
                                value={selectedYearIndex}
                                onChange={(_, value: number) => setSelectedYearIndex(value)}
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                {academicYears.map((yearItem) => (
                                    <Tab
                                        key={yearItem.id}
                                        label={`Academic Year ${yearItem.year}`}
                                        sx={{ fontWeight: 700, textTransform: 'none' }}
                                    />
                                ))}
                            </Tabs>
                        </Box>
                    </Paper>

                    {/* Macro Timeline Bar */}
                    <MacroGanttCard year={currentAcademicYear} terms={currentTerms} />

                    {/* View Switcher Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Tabs
                            value={viewMode}
                            onChange={(_, val: 'agenda' | 'grid' | 'table') => setViewMode(val)}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
                            }}
                        >
                            <Tab icon={<ViewAgendaIcon />} iconPosition="start" label="Agenda View" value="agenda" />
                            <Tab icon={<GridViewIcon />} iconPosition="start" label="Calendar Grid" value="grid" />
                            <Tab icon={<TableChartIcon />} iconPosition="start" label="Data Table" value="table" />
                        </Tabs>

                        <Chip
                            label={`Active Year Scope: ${currentAcademicYear.year}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    {/* VIEW 1: AGENDA ACCORDION VIEW */}
                    {viewMode === 'agenda' && (
                        <AgendaView
                            terms={currentTerms}
                            events={currentEvents}
                            onAddEventClick={(termDate) => {
                                setSelectedGridDate(termDate);
                                setIsEventModalOpen(true);
                            }}
                        />
                    )}

                    {/* VIEW 2: INTERACTIVE CALENDAR GRID */}
                    {viewMode === 'grid' && (
                        <CalendarGridView
                            currentGridMonth={currentGridMonth}
                            setCurrentGridMonth={setCurrentGridMonth}
                            terms={currentTerms}
                            events={currentEvents}
                            onSelectDate={(dateStr) => {
                                setSelectedGridDate(dateStr);
                                setIsEventModalOpen(true);
                            }}
                        />
                    )}

                    {/* VIEW 3: DATA TABLE VIEW */}
                    {viewMode === 'table' && <DataTableView terms={currentTerms} events={currentEvents} />}
                </>
            )}

            {/* MODAL A: ACADEMIC YEAR WIZARD */}
            <AcademicYearWizardModal
                open={isYearWizardOpen}
                onClose={() => setIsYearWizardOpen(false)}
            />

            {/* MODAL B: ADD TERM MODAL */}
            {currentAcademicYear && (
                <AddTermModal
                    open={isTermModalOpen}
                    onClose={() => setIsTermModalOpen(false)}
                    academicYear={currentAcademicYear}
                />
            )}

            {/* MODAL C: ADD EVENT MODAL */}
            {currentAcademicYear && (
                <AddEventModal
                    open={isEventModalOpen}
                    onClose={() => setIsEventModalOpen(false)}
                    academicYear={currentAcademicYear}
                    terms={currentTerms}
                    initialDate={selectedGridDate}
                />
            )}
        </Container>
    );
}