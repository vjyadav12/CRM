import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    Select,
    InputLabel,
    FormControl,
    Chip,
    Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [managers, setManagers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client: '',
        startDate: '',
        endDate: '',
        status: 'Not Started',
        priority: 'Medium',
        projectManager: '',
        teamMembers: [],
        budget: ''
    });

    const statuses = ['Not Started', 'In Progress', 'On Hold', 'Completed'];
    const priorities = ['Low', 'Medium', 'High'];

    useEffect(() => {
        fetchProjects();
        fetchClients();
        fetchManagers();
        fetchEmployees();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('/api/customers');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await axios.get('/api/users/managers');
            setManagers(response.data);
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/users/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleOpen = (project = null) => {
        if (project) {
            setSelectedProject(project);
            setFormData({
                name: project.name,
                description: project.description,
                client: project.client._id,
                startDate: project.startDate.split('T')[0],
                endDate: project.endDate.split('T')[0],
                status: project.status,
                priority: project.priority,
                projectManager: project.projectManager._id,
                teamMembers: project.teamMembers.map(member => member._id),
                budget: project.budget
            });
        } else {
            setSelectedProject(null);
            setFormData({
                name: '',
                description: '',
                client: '',
                startDate: '',
                endDate: '',
                status: 'Not Started',
                priority: 'Medium',
                projectManager: '',
                teamMembers: [],
                budget: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProject(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedProject) {
                await axios.patch(`/api/projects/${selectedProject._id}`, formData);
            } else {
                await axios.post('/api/projects', formData);
            }
            fetchProjects();
            handleClose();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`/api/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Box sx={{ width: '100%', px: { xs: 1, sm: 3, md: 6 }, pt: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3}}>
                <Grid item>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Projects
                    </Typography>
                </Grid>
                <Grid item>
                    {(user.role === 'admin' || user.role === 'manager') && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                        >
                            Add Project
                        </Button>
                    )}
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Project Manager</TableCell>
                            <TableCell>Team Size</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project._id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.client?.name}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={project.status}
                                        color={
                                            project.status === 'Completed' ? 'success' :
                                            project.status === 'In Progress' ? 'primary' :
                                            project.status === 'On Hold' ? 'warning' : 'default'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={project.priority}
                                        color={
                                            project.priority === 'High' ? 'error' :
                                            project.priority === 'Medium' ? 'warning' : 'info'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {project.projectManager?.name}
                                    <Typography variant="caption" display="block" color="textSecondary">
                                        {project.projectManager?.department}
                                    </Typography>
                                </TableCell>
                                <TableCell>{project.teamMembers?.length || 0}</TableCell>
                                <TableCell>
                                    {(user.role === 'admin' || user.role === 'manager') && (
                                        <>
                                            <Button
                                                size="small"
                                                onClick={() => handleOpen(project)}
                                                startIcon={<EditIcon />}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(project._id)}
                                                startIcon={<DeleteIcon />}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{selectedProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Client</InputLabel>
                                    <Select
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        label="Client"
                                    >
                                        {clients.map((client) => (
                                            <MenuItem key={client._id} value={client._id}>
                                                {client.name} - {client.company}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        label="Status"
                                    >
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        label="Priority"
                                    >
                                        {priorities.map((priority) => (
                                            <MenuItem key={priority} value={priority}>
                                                {priority}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Project Manager</InputLabel>
                                    <Select
                                        name="projectManager"
                                        value={formData.projectManager}
                                        onChange={handleChange}
                                        label="Project Manager"
                                    >
                                        {managers.map((manager) => (
                                            <MenuItem key={manager._id} value={manager._id}>
                                                {manager.name} - {manager.department} ({manager.role})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Team Members</InputLabel>
                                    <Select
                                        multiple
                                        name="teamMembers"
                                        value={formData.teamMembers}
                                        onChange={handleChange}
                                        label="Team Members"
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const employee = employees.find(emp => emp._id === value);
                                                    return (
                                                        <Chip 
                                                            key={value} 
                                                            label={employee ? employee.name : value}
                                                            size="small"
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {employees.map((employee) => (
                                            <MenuItem key={employee._id} value={employee._id}>
                                                {employee.name} - {employee.department}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Budget"
                                    name="budget"
                                    type="number"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <Typography>$</Typography>
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedProject ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Projects; 