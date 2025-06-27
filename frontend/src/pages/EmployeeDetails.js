import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import axios from 'axios';

const EmployeeDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchTasks();
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredTasks = selectedUser
    ? tasks.filter(task => task.assignedTo?._id === selectedUser)
    : tasks;

  return (
    <Container>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Employee Task Details
          </Typography>
        </Grid>
        <Grid item>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Employee</InputLabel>
            <Select
              value={selectedUser}
              label="Employee"
              onChange={e => setSelectedUser(e.target.value)}
            >
              <MenuItem value="">All Employees</MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Completed On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map(task => (
              <TableRow key={task._id}>
                <TableCell>{task.assignedTo?.name || '-'}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Chip label={task.status} color={task.status === 'Completed' ? 'success' : 'primary'} size="small" />
                </TableCell>
                <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{task.status === 'Completed' && task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeDetails; 