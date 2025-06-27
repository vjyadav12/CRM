import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleDrawerToggle = () => setSidebarOpen((open) => !open);

    return (
        <>
            <Navbar onDrawerToggle={handleDrawerToggle} />
            <Sidebar open={sidebarOpen} onDrawerToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 3 },
                    width: { xs: '100%', sm: `calc(100% - ${240}px)` },
                    mt: { xs: '56px', sm: '64px' }
                }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </>
    );
};

export default PrivateRoute; 