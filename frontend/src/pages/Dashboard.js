import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Chip,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [projectTasks, setProjectTasks] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/projects');
            setProjects(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch projects. Please try again later.');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = async (project) => {
        try {
            setSelectedProject(project);
            const response = await axios.get(`/api/tasks/project/${project._id}`);
            setProjectTasks(response.data);
            setOpenDialog(true);
        } catch (err) {
            console.error('Error fetching project tasks:', err);
            setError('Failed to fetch project tasks. Please try again later.');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProject(null);
        setProjectTasks([]);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Project Dashboard
                    </Typography>
                </Grid>
                
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {project.name}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    Status: <Chip label={project.status} color={
                                        project.status === 'Completed' ? 'success' :
                                        project.status === 'In Progress' ? 'primary' :
                                        project.status === 'On Hold' ? 'warning' : 'default'
                                    } size="small" />
                                </Typography>
                                <Typography variant="body2">
                                    Team Members: {project.teamMembers.length}
                                </Typography>
                                <Typography variant="body2">
                                    Start Date: {new Date(project.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    End Date: {new Date(project.endDate).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleProjectClick(project)}
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedProject && (
                    <>
                        <DialogTitle>
                            {selectedProject.name} - Project Details
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="h6" gutterBottom>
                                Team Members
                            </Typography>
                            <List>
                                {selectedProject.teamMembers.map((member) => (
                                    <ListItem key={member._id}>
                                        <ListItemText
                                            primary={member.name}
                                            secondary={member.department}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Tasks
                            </Typography>
                            <List>
                                {projectTasks.map((task) => (
                                    <ListItem key={task._id}>
                                        <ListItemText
                                            primary={task.title}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        Assigned to: {task.assignedTo.name}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2">
                                                        Status: {task.status} | Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Chip
                                            label={task.status}
                                            color={
                                                task.status === 'Completed' ? 'success' :
                                                task.status === 'In Progress' ? 'primary' :
                                                task.status === 'Review' ? 'warning' : 'default'
                                            }
                                            size="small"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default Dashboard; 