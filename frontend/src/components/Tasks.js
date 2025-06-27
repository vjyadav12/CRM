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
    IconButton,
    Collapse,
    Box
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Comment as CommentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TaskRow = ({ task, projects, users, onEdit, onDelete, currentUser }) => {
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState('');

    const handleAddComment = async () => {
        try {
            await axios.post(`/api/tasks/${task._id}/comments`, { text: comment });
            setComment('');
            window.location.reload(); // Quick solution to refresh comments
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.project?.name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{task.assignedTo?.name}</TableCell>
                <TableCell>
                    {(currentUser.role === 'admin' || currentUser.role === 'manager' || 
                     task.assignedTo?._id === currentUser._id) && (
                        <>
                            <Button
                                size="small"
                                onClick={() => onEdit(task)}
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(task._id)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {task.description}
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                Comments
                            </Typography>
                            {task.comments?.map((comment, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {comment.author?.name} - {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1">{comment.text}</Typography>
                                </Box>
                            ))}
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <TextField
                                    size="small"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<CommentIcon />}
                                    onClick={handleAddComment}
                                    disabled={!comment.trim()}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project: '',
        assignedTo: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '',
        estimatedHours: ''
    });

    useEffect(() => {
        fetchTasks();
        fetchProjects();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleOpen = (task = null) => {
        if (task) {
            setSelectedTask(task);
            setFormData({
                title: task.title,
                description: task.description,
                project: task.project._id,
                assignedTo: task.assignedTo._id,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate.split('T')[0],
                estimatedHours: task.estimatedHours
            });
        } else {
            setSelectedTask(null);
            setFormData({
                title: '',
                description: '',
                project: '',
                assignedTo: '',
                status: 'To Do',
                priority: 'Medium',
                dueDate: '',
                estimatedHours: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTask) {
                await axios.patch(`/api/tasks/${selectedTask._id}`, formData);
            } else {
                await axios.post('/api/tasks', formData);
            }
            fetchTasks();
            handleClose();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
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
        <Container>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Grid item>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Tasks
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
                            Add Task
                        </Button>
                    )}
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Title</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Assigned To</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TaskRow
                                key={task._id}
                                task={task}
                                projects={projects}
                                users={users}
                                onEdit={handleOpen}
                                onDelete={handleDelete}
                                currentUser={user}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{selectedTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Project"
                                name="project"
                                select
                                value={formData.project}
                                onChange={handleChange}
                                required
                            >
                                {projects.map((project) => (
                                    <MenuItem key={project._id} value={project._id}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Assigned To"
                                name="assignedTo"
                                select
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                            >
                                {users.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                name="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Status"
                                name="status"
                                select
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                {['To Do', 'In Progress', 'Review', 'Completed'].map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Priority"
                                name="priority"
                                select
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                {['Low', 'Medium', 'High'].map((priority) => (
                                    <MenuItem key={priority} value={priority}>
                                        {priority}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Estimated Hours"
                                name="estimatedHours"
                                type="number"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedTask ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Tasks; 