
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AnimatedPage from '../components/AnimatedPage';

const OrdersPage = ({ fromHome }) => {
    const content = (
        <div className={fromHome ? "" : "container mt-5"}>
            {!fromHome && (
                <Link to="/" className="text-decoration-none">
                    <div className="mb-4 btn-back-home">
                         <FaArrowLeft /> BACK TO HOME
                    </div>
                </Link>
            )}
            <h2 className="text-center mb-4" style={{ fontWeight: 800 }}>Your Orders</h2>
            <div className="alert alert-info">You have no orders yet.</div>
        </div>
    );

    return fromHome ? content : <AnimatedPage>{content}</AnimatedPage>;
};

export default OrdersPage;
