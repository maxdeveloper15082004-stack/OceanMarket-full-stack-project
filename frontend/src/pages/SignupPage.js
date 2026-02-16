import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import axios from 'axios';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/users/users/', {
                username: formData.email,
                email: formData.email,
                password: formData.password,
                first_name: formData.name
            });
            
            // Redirect to login page on success
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Check for username/email already exists error
                if (err.response.data.username || err.response.data.email) {
                    setError('An account with this email already exists.');
                } else {
                    setError('Registration failed. Please check your details.');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <AnimatedPage>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', padding: '20px 0' }}>
                <Card style={{ width: '400px', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4 fw-bold" style={{ color: 'black' }}>Sign Up</h2>
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                    type="tel" 
                                    placeholder="Enter phone number" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Confirm Password" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0ea5e9', border: 'none' }}>
                                Sign Up
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <span className="text-muted">Already have an account? </span>
                            <Link to="/login" className="text-decoration-none" style={{ color: '#0ea5e9' }}>Login</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </AnimatedPage>
    );
};

export default SignupPage;
