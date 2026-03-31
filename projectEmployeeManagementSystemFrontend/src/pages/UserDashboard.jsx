import React, { useState, useEffect } from 'react';

const UserDashboard = ({ currentUser }) => {
    const [tasks, setTasks] = useState([]);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || ''
    });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchTasks();
        fetchUserProfile();
    }, []);

    // GET /tasks/user/{userId}
    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:8090/tasks/user/${currentUser.id}`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            showMessage('Failed to fetch tasks', 'error');
        } finally {
            setLoading(false);
        }
    };

    // GET /users/{id}
    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8090/users/${currentUser.id}`);
            const user = await response.json();
            setProfileData({
                name: user.name,
                email: user.email
            });
        } catch (error) {
            console.error('Failed to fetch profile');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // PUT /users/update/{id}
    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8090/users/update/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });
            
            const updatedUser = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            window.location.reload();
            showMessage('Profile updated successfully', 'success');
        } catch (error) {
            showMessage('Failed to update profile', 'error');
        }
    };

    // PUT /users/changePassword/{id}
    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        if (passwordData.newPassword.length < 4) {
            showMessage('Password must be at least 4 characters', 'error');
            return;
        }
        
        try {
            await fetch(`http://localhost:8090/users/changePassword/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordData.newPassword }),
            });
            
            setShowChangePassword(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
            showMessage('Password changed successfully', 'success');
        } catch (error) {
            showMessage('Failed to change password', 'error');
        }
    };

    // PUT /tasks/{taskId}/status
    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8090/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            
            const updatedTask = await response.json();
            setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
            showMessage('Task status updated', 'success');
        } catch (error) {
            showMessage('Failed to update task status', 'error');
        }
    };

    const getStatusColor = (status) => {
        return status === 'COMPLETED' ? '#28a745' : '#ffc107';
    };

    if (loading) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 70px)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '20px', color: 'white' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: 'calc(100vh - 70px)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {message.text && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        padding: '10px 20px',
                        background: message.type === 'success' ? '#28a745' : '#dc3545',
                        color: 'white',
                        borderRadius: '5px',
                        zIndex: 1000,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#667eea' }}>My Profile</h2>
                    
                    {editingProfile ? (
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleUpdateProfile}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                    Save Changes
                                </button>
                                <button onClick={() => setEditingProfile(false)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Name:</strong> {currentUser.name}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <p><strong>User ID:</strong> {currentUser.id}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button onClick={() => setEditingProfile(true)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                    Edit Profile
                                </button>
                                <button onClick={() => setShowChangePassword(!showChangePassword)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#17a2b8',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                    Change Password
                                </button>
                            </div>
                            
                            {showChangePassword && (
                                <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '5px' }}>
                                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Change Password</h4>
                                    <div style={{ marginBottom: '10px' }}>
                                        <input
                                            type="password"
                                            placeholder="New Password (min 4 characters)"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                marginBottom: '10px'
                                            }}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </div>
                                    <button onClick={handleChangePassword}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                        Update Password
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#667eea' }}>My Tasks ({tasks.length})</h2>
                    
                    {tasks.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No tasks assigned yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#667eea', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '12px' }}><strong>{task.title}</strong></td>
                                            <td style={{ padding: '12px' }}>{task.description || '-'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    background: getStatusColor(task.status),
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        border: '1px solid #667eea',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        background: 'white',
                                                        color: '#333'
                                                    }}>
                                                    <option value="PENDING">Mark PENDING</option>
                                                    <option value="COMPLETED">Mark COMPLETED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;