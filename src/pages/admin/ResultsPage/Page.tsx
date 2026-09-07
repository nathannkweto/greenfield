import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    Typography
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import { getResults } from '../../../api/generated';
import { GET_RESULTS_PAGE } from './queries';

export type AssessmentType = 'END_OF_TERM' | 'FINAL_EXAM';

export interface Assessment {
    id: string;
    title: string;
    type: AssessmentType;
    term?: number;
    maxScore: number;
    weightPercentage: number;
    dueDate?: string;
}

export interface CurriculumNode {
    id: string;
    year: number;
    assessments: Assessment[];
}

export interface CourseNode {
    id: string;
    code: string;
    title: string;
    curricula: CurriculumNode[];
}

export interface ResultsData {
    courses: {
        edges: Array<{
            node: CourseNode;
        }>;
    };
}

export default function ResultsPage() {
    const { data, loading, error, refetch } = useQuery<ResultsData>(GET_RESULTS_PAGE, {
        variables: { first: 100 },
    });

    const [notifyStudents, setNotifyStudents] = useState(true);
    const [publishing, setPublishing] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const publish = async (id: string) => {
        setPublishing(id);
        setMessage(null);
        try {
            await getResults().postResultsPublicIdPublish(id, { notify_students: notifyStudents });
            setMessage({ type: 'success', text: 'Results published successfully.' });
            await refetch();
        } catch (requestError) {
            setMessage({
                type: 'error',
                text: requestError instanceof Error ? requestError.message : 'Unable to publish results.',
            });
        } finally {
            setPublishing(null);
        }
    };

    const assessmentList = (data?.courses.edges || []).flatMap(({ node: course }) =>
        (course.curricula || []).flatMap((curriculum) =>
            (curriculum.assessments || []).map((assessment) => ({
                ...assessment,
                courseCode: course.code,
                courseTitle: course.title,
                year: curriculum.year,
            }))
        )
    );

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', py: 4 }}>
            <Container maxWidth="lg" sx={{ display: 'grid', gap: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Results Publishing
                    </Typography>
                    <Typography color="text.secondary">
                        Publish completed assessment results to enrolled students.
                    </Typography>
                </Box>

                {message && <Alert severity={message.type}>{message.text}</Alert>}

                <Paper variant="outlined">
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notifyStudents}
                                    onChange={(e) => setNotifyStudents(e.target.checked)}
                                />
                            }
                            label="Notify students when results publish"
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error.message}
                        </Alert>
                    ) : assessmentList.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No assessments found.</Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {assessmentList.map((item, index) => (
                                <Box key={item.id}>
                                    {index > 0 && <Divider />}
                                    <ListItem
                                        secondaryAction={
                                            <Button
                                                startIcon={<PublishIcon />}
                                                variant="contained"
                                                onClick={() => publish(item.id)}
                                                disabled={publishing === item.id}
                                            >
                                                {publishing === item.id ? 'Publishing…' : 'Publish'}
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {item.courseCode}: {item.title}
                                                </Typography>
                                            }
                                            secondary={`${item.type.replace('_', ' ')} · Year ${item.year}${
                                                item.term ? `, Term ${item.term}` : ''
                                            } · Max score: ${item.maxScore} · Weight: ${item.weightPercentage}%`}
                                        />
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}