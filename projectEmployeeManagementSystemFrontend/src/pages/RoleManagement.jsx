import React, { useState, useEffect } from 'react';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ name: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchRoles();
    }, []);

    // GET /roles/all
    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:8090/roles/all');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            showMessage('Failed to fetch roles', 'error');
        } finally {
            setLoading(false);
        }
    };

    // POST /roles/create
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRole.name.trim()) {
            showMessage('Role name is required', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:8090/roles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRole),
            });

            const createdRole = await response.json();
            setRoles([...roles, createdRole]);
            setNewRole({ name: '' });
            showMessage('Role created successfully', 'success');
        } catch (error) {
            showMessage('Failed to create role', 'error');
        }
    };

    // GET /roles/{id}
    const handleGetRoleById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8090/roles/${id}`);
            const role = await response.json();
            alert(`Role Details:\nID: ${role.id}\nName: ${role.name}`);
        } catch (error) {
            showMessage('Failed to fetch role details', 'error');
        }
    };

    // GET /roles/name/{name}
    const handleGetRoleByName = async (name) => {
        try {
            const response = await fetch(`http://localhost:8090/roles/name/${name}`);
            const role = await response.json();
            alert(`Role Details:\nID: ${role.id}\nName: ${role.name}`);
        } catch (error) {
            showMessage('Role not found', 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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

                {/* Create Role Form */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Create New Role</h2>
                    <form onSubmit={handleCreateRole}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                                Role Name
                            </label>
                            <input
                                type="text"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ name: e.target.value.toUpperCase() })}
                                placeholder="e.g., MANAGER, USER, ADMIN"
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
                            style={{
                                padding: '10px 20px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Create Role
                        </button>
                    </form>
                </div>

                {/* Role Search Section */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Search Roles</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                const id = prompt('Enter Role ID:');
                                if (id) handleGetRoleById(id);
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Get Role by ID
                        </button>
                        <button
                            onClick={() => {
                                const name = prompt('Enter Role Name:');
                                if (name) handleGetRoleByName(name.toUpperCase());
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Get Role by Name
                        </button>
                    </div>
                </div>

                {/* All Roles List */}
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#667eea' }}>All Roles ({roles.length})</h2>
                    
                    {roles.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No roles found. Create your first role!</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#667eea', color: 'white' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Role Name</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map(role => (
                                        <tr key={role.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '12px' }}>{role.id}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    background: role.name === 'ADMIN' ? '#dc3545' : '#28a745',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {role.name}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <button
                                                    onClick={() => handleGetRoleById(role.id)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: '#17a2b8',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        marginRight: '5px'
                                                    }}
                                                >
                                                    View Details
                                                </button>
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

export default RoleManagement;