import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { getCart, removeFromCart, addToCart } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
};

const CartPage = ({ fromHome }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getCart()
            .then(response => {
                setCartItems(response.data.items || []);
                setTotal(response.data.total_price || 0);
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                setCartItems([
                    { product: { id: 1, name: 'Salmon', price: 200 }, quantity: 2, total: 400 },
                ]);
                setTotal(400);
            })
            .finally(() => setLoading(false));
    }, []);

    const updateQuantity = (productId, delta) => {
        const item = cartItems.find(i => i.product.id === productId);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (newQty < 1) return;

        addToCart({ product_id: productId, quantity: delta }).then(() => {
             setCartItems(prev => prev.map(i => 
                i.product.id === productId ? { ...i, quantity: newQty } : i
            ));
            setTotal(prev => prev + (Number(item.product.price) * delta));
        }).catch(err => console.error("Failed to update quantity", err));
    };

    const handleRemove = (productId) => {
        removeFromCart(productId).then(() => {
            const removedItem = cartItems.find(item => item.product.id === productId);
            if (removedItem) {
                setTotal(prev => prev - (removedItem.product.price * removedItem.quantity));
                setCartItems(prev => prev.filter(item => item.product.id !== productId));
            }
        }).catch(err => console.error("Failed to remove item", err));
    };

    const handleCheckout = () => {
        // Implement checkout
        console.log('Proceed to checkout');
    };

    const content = (
        <div className={fromHome ? "" : "container mt-5"}>
            {!fromHome && (
                <div className="mb-4 d-flex justify-content-between align-items-center">
                     <Link to="/" className="text-decoration-none">
                        <div className="btn-back-home">
                            <FaArrowLeft /> BACK TO HOME
                        </div>
                    </Link>
                </div>
            )}

            <motion.h2 
                className="mb-4 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ fontWeight: 800 }}
            >
                Shopping Cart
            </motion.h2>

            {loading ? (
                <div className="text-center py-5" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <AnimatePresence>
                            {cartItems.length > 0 ? (
                                cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.product?.id || index}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="mb-3"
                                    >
                                        <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                                            <Card.Body className="p-0">
                                                <div className="d-flex align-items-center p-3">
                                                    {/* Image */}
                                                    <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }} className="me-3">
                                                        <img 
                                                            src={item.product.image || 'https://via.placeholder.com/150'} 
                                                            alt={item.product.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <h5 className="fw-bold mb-0">{item.product.name}</h5>
                                                            <Button 
                                                                variant="link" 
                                                                className="text-muted p-0"
                                                                onClick={() => handleRemove(item.product.id)}
                                                            >
                                                                <FaTrash size={16} />
                                                            </Button>
                                                        </div>
                                                        
                                                        <div className="d-flex justify-content-between align-items-end">
                                                            <div>
                                                                <p className="mb-0 fw-bold text-dark">₹{item.product.price} <small className="text-muted fw-normal">/ kg</small></p>
                                                                <small className="text-muted">60 Cal.</small>
                                                            </div>
                                                            
                                                            {/* Quantity Stepper */}
                                                            <div className="d-flex align-items-center bg-light rounded px-2 py-1 user-select-none" style={{ minWidth: '80px', justifyContent: 'space-between' }}>
                                                                <motion.button 
                                                                    whileTap={{ scale: 0.8 }}
                                                                    className="btn btn-link text-dark p-0 border-0 text-decoration-none"
                                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                                    style={{ width: '24px', height: '24px', lineHeight: '1' }}
                                                                >
                                                                    <FaMinus size={10} />
                                                                </motion.button>
                                                                
                                                                <span className="mx-2 fw-bold small">{item.quantity}</span>
                                                                
                                                                <motion.button 
                                                                    whileTap={{ scale: 0.8 }}
                                                                    className="btn btn-link text-dark p-0 border-0 text-decoration-none"
                                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                                    style={{ width: '24px', height: '24px', lineHeight: '1' }}
                                                                >
                                                                    <FaPlus size={10} />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <h4 className="text-muted">Your cart is empty</h4>
                                    <Link to="/" className="btn btn-primary mt-3 rounded-pill px-4">Continue Shopping</Link>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Total and Checkout */}
                        {cartItems.length > 0 && (
                             <motion.div 
                                layout 
                                className="mt-4 pt-3 border-top"
                             >
                                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                    <span className="h5 text-muted mb-0">Total</span>
                                    <h3 className="fw-bold mb-0">₹{total}</h3>
                                </div>
                                <Button 
                                    variant="success" 
                                    size="lg" 
                                    className="w-100 rounded-pill fw-bold py-3 shadow-sm"
                                    onClick={handleCheckout}
                                    style={{ background: '#198754', border: 'none' }}
                                >
                                    Proceed to Checkout
                                </Button>
                             </motion.div>
                        )}
                    </Col>
                </Row>
                </>
            )}
        </div>
    );

    return fromHome ? content : <AnimatedPage>{content}</AnimatedPage>;
};

export default CartPage;
