import { Paper, Box, Typography, Button, Stack, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import type {FormattedYear} from '../types';
import { formatLecturerName } from '../helpers';

interface CurriculumSectionProps {
    formattedCurriculum: FormattedYear[];
    onOpenCourseModal: (year: number) => void;
}

export default function CurriculumSection({
                                              formattedCurriculum,
                                              onOpenCourseModal,
                                          }: CurriculumSectionProps) {
    return (
        <Stack spacing={2.5}>
            {formattedCurriculum.map((yearData) => (
                <Paper key={yearData.year} variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            Year {yearData.year}
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            variant="text"
                            onClick={() => onOpenCourseModal(yearData.year)}
                        >
                            Add Course
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {yearData.items.length > 0 ? (
                            yearData.items.map((item) => (
                                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'action.hover',
                                            borderRadius: 2,
                                            border: 1,
                                            borderColor: 'divider',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box>
                                            {item.course?.code && (
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                                    {item.course.code}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                {item.course?.title || 'Untitled Course'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 1.5 }}>
                                            {item.lecturer && (
                                                <Chip
                                                    icon={<PersonIcon fontSize="small" />}
                                                    label={formatLecturerName(item.lecturer)}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ mb: 1, maxWidth: '100%' }}
                                                />
                                            )}
                                            {item.course?.credits !== undefined && (
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {item.course.credits} Credits
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    No courses configured for Year {yearData.year}.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
        </Stack>
    );
}