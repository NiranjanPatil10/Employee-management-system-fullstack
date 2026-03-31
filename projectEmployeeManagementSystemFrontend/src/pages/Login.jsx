import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setCurrentUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Admin login
            if (formData.email === 'admin@gmail.com' && formData.password === '12345') {
                const adminUser = {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@gmail.com'
                };
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                setCurrentUser(adminUser);
                navigate('/admin-dashboard');
                return;
            }

            // User login - Call backend API
            const response = await fetch('http://localhost:8090/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const user = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);
            navigate('/user-dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 70px)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '400px',
                width: '100%',
                margin: '0 auto',
                padding: '30px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Welcome Back</h2>
                
                {error && (
                    <div style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#667eea' }}>Register</Link>
                </p>
                
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '5px',
                    fontSize: '12px',
                    textAlign: 'center'
                }}>
                    <strong>Demo Credentials:</strong><br />
                    admin@gmail.com / 12345
                </div>
            </div>
        </div>
    );
};

export default Login;