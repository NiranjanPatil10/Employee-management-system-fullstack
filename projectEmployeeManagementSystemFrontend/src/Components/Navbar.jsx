import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ currentUser, setCurrentUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate('/login');
    };

    return (
        <nav style={{
            background: '#1a1a2e',
            padding: '15px 20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
                📋 EMS
            </Link>

            <div>
                {currentUser ? (
                    // Show when user is logged in
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>👤 {currentUser.name}</span>
                        {currentUser.email === 'admin@gmail.com' ? (
                            // Admin buttons
                            <>
                                <Link to="/admin-dashboard" style={{ 
                                    color: 'white', 
                                    textDecoration: 'none', 
                                    padding: '5px 15px', 
                                    background: '#007bff', 
                                    borderRadius: '5px' 
                                }}>
                                    Dashboard
                                </Link>
                                <Link to="/role-management" style={{ 
                                    color: 'white', 
                                    textDecoration: 'none', 
                                    padding: '5px 15px', 
                                    background: '#28a745', 
                                    borderRadius: '5px' 
                                }}>
                                    Manage Roles
                                </Link>
                            </>
                        ) : (
                            // Regular user button
                            <Link to="/user-dashboard" style={{ 
                                color: 'white', 
                                textDecoration: 'none', 
                                padding: '5px 15px', 
                                background: '#007bff', 
                                borderRadius: '5px' 
                            }}>
                                Dashboard
                            </Link>
                        )}
                        <button onClick={handleLogout} style={{
                            padding: '5px 15px',
                            background: '#dc3545',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    // Show only login button when no user is logged in
                    <Link to="/login" style={{
                        color: 'white',
                        textDecoration: 'none',
                        padding: '5px 15px',
                        background: '#007bff',
                        borderRadius: '5px'
                    }}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;