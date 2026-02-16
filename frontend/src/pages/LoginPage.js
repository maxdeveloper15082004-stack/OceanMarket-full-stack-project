
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Using existing backend endpoint (assuming relative path or specific config)
            // If proxy is not set, full URL likely needed: http://127.0.0.1:8000/api/token/
            // But usually React apps use proxy in package.json.
            // Let's assume proxy or direct URL. Since package.json didn't show proxy, maybe direct URL?
            // But typical setup is localhost:8000.
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: email, // Django SimpleJWT expects 'username' by default, even if it's an email
                password: password
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_email', email); // For display

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Please check your email and password.');
        }
    };

    return (
        <AnimatedPage>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card style={{ width: '400px', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4 fw-bold" style={{ color: 'black' }}>Login</h2>
                        
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0ea5e9', border: 'none' }}>
                                Login
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/signup" className="text-decoration-none" style={{ color: '#0ea5e9' }}>Sign up</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </AnimatedPage>
    );
};

export default LoginPage;
