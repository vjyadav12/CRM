import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import EmployeeDetails from './pages/EmployeeDetails';

const App = () => {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          <Route path="/employee-details" element={<PrivateRoute><EmployeeDetails /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
};

export default App; 