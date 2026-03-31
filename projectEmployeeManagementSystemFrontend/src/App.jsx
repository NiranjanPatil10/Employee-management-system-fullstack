import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RoleManagement from './pages/RoleManagement'; // Make sure this path is correct

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-dashboard" element={
                    currentUser && (currentUser.email === 'admin@gmail.com') ? 
                    <AdminDashboard currentUser={currentUser} /> : 
                    <Navigate to="/login" />
                } />
                <Route path="/user-dashboard" element={
                    currentUser ? 
                    <UserDashboard currentUser={currentUser} /> : 
                    <Navigate to="/login" />
                } />
                <Route path="/role-management" element={
                    currentUser && (currentUser.email === 'admin@gmail.com') ? 
                    <RoleManagement /> : 
                    <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default App;