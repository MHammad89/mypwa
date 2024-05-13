import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getFingerprint } from '../utilities/fingerprint';

function RegistrationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fingerprintData = await getFingerprint();
    
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', { // Ensure this URL is correct
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, fingerprint: fingerprintData })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Registration successful', data);
                // Additional logic if needed
            } else {
                throw new Error(data.message || "Failed to register");
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button style={{ display: 'block', margin: '20px auto', backgroundColor: '#343a40', color: 'white', border: 'none' }} type="submit">
                Register
            </Button>
        </Form>
    );
}

export default RegistrationForm;