import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';

const Navigation = () => {
    const [username, setUsername] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('user_email');
        if (email) {
            const name = email.split('@')[0];
            setUsername(name);
        } else {
            setUsername(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user_email');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUsername(null);
        navigate('/');
    };

    const isOnAdminPage = location.pathname === '/admin-dashboard';
    const email = localStorage.getItem('user_email');
    const isAdmin = email === 'maxanmax@gmail.com';

    return (
        <Navbar expand="lg" className="navbar-custom sticky-top">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={Link} to="/" className="brand-text fs-4">
                    <span role="img" aria-label="fish">🐟</span> Ocean Market
                </Navbar.Brand>
                
                {username ? (
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic" className="d-flex align-items-center gap-2 border-0 bg-transparent text-dark nav-btn-outline">
                            <FaUser /> {username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Link to="/login" className="text-decoration-none">
                        <div className="nav-btn nav-btn-outline d-flex align-items-center gap-2">
                            <FaUser /> Login
                        </div>
                    </Link>
                )}
            </Container>
        </Navbar>
    );
};

export default Navigation;
