import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFingerprint } from '../utilities/fingerprint'; // Make sure to define this function

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fingerprintData = await getFingerprint();
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, fingerprint: fingerprintData })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful', data);  // Ensure this log is appearing
                localStorage.setItem('token', data.accessToken);  // Store JWT in localStorage
                navigate('/dashboard');  // Redirect to dashboard
            } else {
                throw new Error(data.message || "Unable to login");
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
}

export default LoginForm;