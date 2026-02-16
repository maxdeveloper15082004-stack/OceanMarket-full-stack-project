import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { getWishlist, removeFromWishlist, getCart, addToCart, removeFromCart } from '../services/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1 } 
    }
};

const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
};

const WishlistPage = ({ fromHome }) => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [cartIds, setCartIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
        fetchCart();
    }, []);

    const fetchWishlist = () => {
        setLoading(true);
        getWishlist().then(res => {
            setWishlistProducts(res.data.products || []);
        }).catch(err => {
            console.error("Failed to fetch wishlist", err);
            setWishlistProducts([]);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
            setWishlistProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCart = () => {
        getCart().then(res => {
            const items = res.data.items || [];
            const ids = items.map(item => item.product.id);
            setCartIds(ids);
        }).catch(err => console.error("Failed to fetch cart", err));
    };

    const handleToggleCart = async (product) => {
        if (cartIds.includes(product.id)) {
            try {
                await removeFromCart(product.id);
                setCartIds(prev => prev.filter(id => id !== product.id));
            } catch (error) {
                console.error("Failed to remove from cart", error);
            }
        } else {
            try {
                await addToCart({ product_id: product.id, quantity: 1 });
                setCartIds(prev => [...prev, product.id]);
                alert("Added to cart!");
            } catch (error) {
                console.error("Failed to add to cart", error);
            }
        }
    };

    const content = (
        <div className={fromHome ? "" : "mt-5"}>
            {!fromHome && (
                <Container>
                    <Link to="/" className="text-decoration-none">
                        <div className="mb-4 btn-back-home">
                            <FaArrowLeft /> BACK TO HOME
                        </div>
                    </Link>
                </Container>
            )}
            
            <motion.h2 
                className="mb-4 text-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ fontWeight: 800 }}
            >Your Wishlist</motion.h2>

            {loading ? (
                <div className="text-center py-5" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <motion.div
                    variants={!fromHome ? containerVariants : {}}
                    initial={!fromHome ? "hidden" : "visible"}
                    animate="visible"
                >
                    <Row>
                        <AnimatePresence>
                            {wishlistProducts.length > 0 ? (
                            wishlistProducts.map((product) => (
                                <Col key={product.id} md={4} className="mb-4">
                                    <motion.div 
                                        variants={itemVariants} 
                                        exit={{ scale: 0, opacity: 0 }}
                                        layout
                                    >
                                        <Card className="h-100 card-hover shadow border-0" style={{ borderRadius: '16px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <Card.Img 
                                                    variant="top" 
                                                    src={product.image || 'https://via.placeholder.com/150'} 
                                                    style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} 
                                                />
                                            </div>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <Card.Title style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: 0 }}>{product.name}</Card.Title>
                                                    <Form.Select size="sm" style={{ borderRadius: '8px', width: 'auto', padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.8rem' }} defaultValue={product.weight}>
                                                        <option value="1/2 kg">1/2 kg</option>
                                                        <option value="1 kg">1 kg</option>
                                                        <option value="1 1/2 kg">1.5 kg</option>
                                                        <option value="2 kg">2 kg</option>
                                                        <option value="2 1/2 kg">2.5 kg</option>
                                                        <option value="3 kg">3 kg</option>
                                                    </Form.Select>
                                                </div>

                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div>
                                                        <h4 className="mb-0 fw-bold" style={{ color: '#0284c7' }}>₹{product.price}</h4>
                                                        <div style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <motion.button 
                                                            whileTap={{ scale: 0.9 }}
                                                            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0' }}
                                                            onClick={() => handleRemove(product.id)}
                                                        >
                                                            <FaHeart className="text-danger" />
                                                        </motion.button>
                                                        <motion.button 
                                                            whileTap={!(product.stock <= 0 && !cartIds.includes(product.id)) ? { scale: 0.9 } : {}}
                                                            className={`btn d-flex align-items-center gap-2`}
                                                            style={{ 
                                                                borderRadius: '8px', 
                                                                padding: '0.5rem 1rem', 
                                                                border: 'none',
                                                                backgroundColor: cartIds.includes(product.id) ? '#dc3545' : (product.stock <= 0 ? 'black' : '#0ea5e9'),
                                                                color: 'white',
                                                                cursor: (product.stock <= 0 && !cartIds.includes(product.id)) ? 'not-allowed' : 'pointer'
                                                            }}
                                                            onClick={() => {
                                                                if (product.stock <= 0 && !cartIds.includes(product.id)) return;
                                                                handleToggleCart(product);
                                                            }}
                                                        >
                                                            <FaShoppingCart /> {cartIds.includes(product.id) ? 'Remove' : 'Add'}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))
                        ) : (
                            <motion.p variants={itemVariants} className="text-center w-100">Your wishlist is empty.</motion.p>
                        )}
                    </AnimatePresence>
                </Row>
            </motion.div>
            )}
        </div>
    );

    return fromHome ? content : <AnimatedPage>{content}</AnimatedPage>;
};


export default WishlistPage;
