import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tasks, setTasks] = useState({});
    const [userRoles, setUserRoles] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showAssignTask, setShowAssignTask] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'PENDING' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const ADMIN_ID = 1; // Hardcoded admin ID for demo

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // GET /users/getAll/{adminId}
    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8090/users/getAll/${ADMIN_ID}`);
            const data = await response.json();
            setUsers(data);
            // Fetch roles for each user
            data.forEach(user => fetchUserRoles(user.id));
        } catch (error) {
            showMessage('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    // GET /roles/all
    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8090/roles/all');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles');
        }
    };

    // GET /user-roles/user/{userId}
    const fetchUserRoles = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8090/user-roles/user/${userId}`);
            const data = await response.json();
            setUserRoles(prev => ({ ...prev, [userId]: data }));
        } catch (error) {
            console.error('Failed to fetch user roles');
        }
    };

    // GET /tasks/user/{userId}
    const fetchUserTasks = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8090/tasks/user/${userId}`);
            const data = await response.json();
            setTasks(prev => ({ ...prev, [userId]: data }));
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // PUT /users/update/{id}
    const handleUpdateUser = async (userId, updatedData) => {
        try {
            const response = await fetch(`http://localhost:8090/users/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            
            const updatedUser = await response.json();
            setUsers(users.map(user => user.id === userId ? updatedUser : user));
            setEditingUser(null);
            showMessage('User updated successfully', 'success');
        } catch (error) {
            showMessage('Failed to update user', 'error');
        }
    };

    // DELETE /users/{id}/{adminId}
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await fetch(`http://localhost:8090/users/${userId}/${ADMIN_ID}`, { method: 'DELETE' });
                setUsers(users.filter(user => user.id !== userId));
                showMessage('User deleted successfully', 'success');
            } catch (error) {
                showMessage('Failed to delete user', 'error');
            }
        }
    };

    // PUT /users/changePassword/{id}
    const handleChangePassword = async (userId) => {
        if (!newPassword || newPassword.length < 4) {
            showMessage('Password must be at least 4 characters', 'error');
            return;
        }
        
        try {
            await fetch(`http://localhost:8090/users/changePassword/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
            });
            
            setShowChangePassword(null);
            setNewPassword('');
            showMessage('Password changed successfully', 'success');
        } catch (error) {
            showMessage('Failed to change password', 'error');
        }
    };

    // POST /user-roles/assign?userId=&roleId=&adminId=
    const handleAssignRole = async (userId, roleId) => {
        if (!roleId) return;
        
        try {
            await fetch(`http://localhost:8090/user-roles/assign?userId=${userId}&roleId=${roleId}&adminId=${ADMIN_ID}`, {
                method: 'POST',
            });
            showMessage('Role assigned successfully', 'success');
            fetchUserRoles(userId); // Refresh user roles
        } catch (error) {
            showMessage('Failed to assign role', 'error');
        }
    };

    // POST /tasks/assign/{userId}/{adminId}
    const handleAssignTask = async (userId) => {
        if (!newTask.title) {
            showMessage('Task title is required', 'error');
            return;
        }
        
        try {
            await fetch(`http://localhost:8090/tasks/assign/${userId}/${ADMIN_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            
            setShowAssignTask(null);
            setNewTask({ title: '', description: '', status: 'PENDING' });
            fetchUserTasks(userId);
            showMessage('Task assigned successfully', 'success');
        } catch (error) {
            showMessage('Failed to assign task', 'error');
        }
    };

    // DELETE /tasks/{taskId}
    const handleDeleteTask = async (taskId, userId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await fetch(`http://localhost:8090/tasks/${taskId}`, { method: 'DELETE' });
                fetchUserTasks(userId);
                showMessage('Task deleted successfully', 'success');
            } catch (error) {
                showMessage('Failed to delete task', 'error');
            }
        }
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
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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

                <h2 style={{ marginBottom: '20px', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                    Admin Dashboard
                </h2>
                
                {users.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <p>No users found. Please add users via registration.</p>
                    </div>
                ) : (
                    users.map(user => (
                        <div key={user.id} style={{
                            background: 'white',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: '#667eea' }}>{user.name}</h3>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Tasks:</strong> {user.tasks?.length || 0} tasks</p>
                                    <p><strong>Roles:</strong> {userRoles[user.id]?.map(ur => ur.role.name).join(', ') || 'No roles assigned'}</p>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#ffc107',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: '#333',
                                            fontWeight: 'bold'
                                        }}>
                                        {editingUser === user.id ? 'Cancel' : 'Edit'}
                                    </button>
                                    
                                    <button onClick={() => setShowChangePassword(showChangePassword === user.id ? null : user.id)}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#17a2b8',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                        Change Password
                                    </button>
                                    
                                    <button onClick={() => {
                                        setShowAssignTask(showAssignTask === user.id ? null : user.id);
                                        fetchUserTasks(user.id);
                                    }}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#28a745',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                        Manage Tasks
                                    </button>
                                    
                                    <select onChange={(e) => handleAssignRole(user.id, parseInt(e.target.value))}
                                        defaultValue=""
                                        style={{
                                            padding: '8px 15px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>
                                        <option value="">Assign Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                    
                                    <button onClick={() => handleDeleteUser(user.id)}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#dc3545',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                        Delete User
                                    </button>
                                </div>
                            </div>
                            
                            {editingUser === user.id && (
                                <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                                    <input
                                        type="text"
                                        defaultValue={user.name}
                                        onBlur={(e) => handleUpdateUser(user.id, { ...user, name: e.target.value })}
                                        placeholder="Name"
                                        style={{
                                            padding: '8px',
                                            marginRight: '10px',
                                            width: '200px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px'
                                        }}
                                    />
                                    <input
                                        type="email"
                                        defaultValue={user.email}
                                        onBlur={(e) => handleUpdateUser(user.id, { ...user, email: e.target.value })}
                                        placeholder="Email"
                                        style={{
                                            padding: '8px',
                                            width: '250px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>
                            )}
                            
                            {showChangePassword === user.id && (
                                <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
                                    <input
                                        type="password"
                                        placeholder="New password (min 4 characters)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{
                                            padding: '8px',
                                            marginRight: '10px',
                                            width: '250px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px'
                                        }}
                                    />
                                    <button onClick={() => handleChangePassword(user.id)}
                                        style={{
                                            padding: '8px 15px',
                                            background: '#28a745',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            color: 'white'
                                        }}>
                                        Update Password
                                    </button>
                                </div>
                            )}
                            
                            {showAssignTask === user.id && (
                                <div style={{ marginTop: '15px' }}>
                                    <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '5px', marginBottom: '15px' }}>
                                        <h4 style={{ marginBottom: '10px', color: '#333' }}>Assign New Task</h4>
                                        <input
                                            type="text"
                                            placeholder="Task Title"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            style={{
                                                padding: '8px',
                                                marginRight: '10px',
                                                width: '200px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            style={{
                                                padding: '8px',
                                                marginRight: '10px',
                                                width: '300px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px'
                                            }}
                                        />
                                        <select
                                            value={newTask.status}
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                            style={{
                                                padding: '8px',
                                                marginRight: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px'
                                            }}>
                                            <option value="PENDING">PENDING</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                        <button onClick={() => handleAssignTask(user.id)}
                                            style={{
                                                padding: '8px 15px',
                                                background: '#28a745',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                color: 'white'
                                            }}>
                                            Assign Task
                                        </button>
                                    </div>
                                    
                                    <h4 style={{ marginBottom: '10px', color: '#333' }}>User Tasks</h4>
                                    {tasks[user.id] && tasks[user.id].length > 0 ? (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: '#f8f9fa' }}>
                                                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Title</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                                                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tasks[user.id].map(task => (
                                                        <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
                                                            <td style={{ padding: '10px' }}>{task.title}</td>
                                                            <td style={{ padding: '10px' }}>{task.description || '-'}</td>
                                                            <td style={{ padding: '10px' }}>
                                                                <span style={{
                                                                    padding: '3px 8px',
                                                                    borderRadius: '3px',
                                                                    background: task.status === 'COMPLETED' ? '#28a745' : '#ffc107',
                                                                    color: 'white',
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {task.status}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '10px' }}>
                                                                <button onClick={() => handleDeleteTask(task.id, user.id)}
                                                                    style={{
                                                                        padding: '5px 10px',
                                                                        background: '#dc3545',
                                                                        border: 'none',
                                                                        borderRadius: '3px',
                                                                        cursor: 'pointer',
                                                                        color: 'white'
                                                                    }}>
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>No tasks assigned</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;