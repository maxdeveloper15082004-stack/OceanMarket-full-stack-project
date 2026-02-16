import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getCategories } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { FaTruck, FaStore, FaHeart, FaClipboardList, FaMapMarkerAlt, FaShoppingCart, FaFish, FaClock } from 'react-icons/fa';
import WishlistPage from './WishlistPage';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';
import AddressPage from './AddressPage';
import CategoryPage from './CategoryPage';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { 
            staggerChildren: 0.1 
        } 
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

const Home = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const dummyImages = {
        'fish': '/images/istockphoto-476899600-612x612.jpg',
        'squid': '/images/istockphoto-1332758804-612x612.jpg',
        'crab': '/images/istockphoto-521707871-612x612.jpg',
        'prawns': '/images/istockphoto-2189451205-612x612.jpg',
    };

    useEffect(() => {
        // Fetch categories from API
        getCategories()
            .then(response => {
                const categoriesData = response.data.map(cat => ({
                    ...cat,
                    image: cat.image || dummyImages[cat.slug] || 'https://via.placeholder.com/150'
                }));
                if (categoriesData.length === 0) {
                     setCategories([
                        { id: 1, name: 'Fish', slug: 'fish', image: dummyImages['fish'], desc: 'Fresh daily catch, premium quality fish' },
                        { id: 2, name: 'Squid', slug: 'squid', image: dummyImages['squid'], desc: 'Fresh squid, cleaned and ready to cook' },
                        { id: 3, name: 'Crab', slug: 'crab', image: dummyImages['crab'], desc: 'Fresh live crab, sweet and tender meat' },
                        { id: 4, name: 'Prawns', slug: 'prawns', image: dummyImages['prawns'], desc: 'Large fresh prawns, peeled and deveined' },
                    ]);
                } else {
                    setCategories(categoriesData.map(c => ({
                        ...c,
                        desc: c.desc || 'Fresh daily seafood straight from the ocean'
                    })));
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setCategories([
                    { id: 1, name: 'Fish', slug: 'fish', image: dummyImages['fish'], desc: 'Fresh daily catch, premium quality fish' },
                    { id: 2, name: 'Squid', slug: 'squid', image: dummyImages['squid'], desc: 'Fresh squid, cleaned and ready to cook' },
                    { id: 3, name: 'Crab', slug: 'crab', image: dummyImages['crab'], desc: 'Fresh live crab, sweet and tender meat' },
                    { id: 4, name: 'Prawns', slug: 'prawns', image: dummyImages['prawns'], desc: 'Large fresh prawns, peeled and deveined' },
                ]);
            });
    }, []);

    return (
        <AnimatedPage>
            {/* Hero Section */}
            <section className="hero-gradient mb-5">
                <Container>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="display-4 fw-bold mb-3">Fresh Seafood, Delivered <br/> Daily</h1>
                        <p className="lead mb-4" style={{ maxWidth: '600px', opacity: 0.9 }}>
                            Premium quality fish and seafood <br/> from the ocean to your door
                        </p>

                    </motion.div>
                </Container>
            </section>

            <Container>
                <div className="mb-4">

                    
                    {/* Pill Navigation */}
                    <motion.div 
                        className="pill-nav"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {['All', 'Wishlist', 'Cart', 'Your Orders', 'Your Address'].map((tab) => (
                            <motion.div 
                                key={tab}
                                variants={itemVariants}
                                className={`pill-item ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(tab);
                                    if (tab === 'All') setSelectedCategory(null);
                                }}
                                style={{ minWidth: 'max-content' }}
                            >
                                {tab === 'Wishlist' && <FaHeart style={{ color: activeTab === tab ? 'white' : 'black' }} />}
                                {tab === 'Cart' && <FaShoppingCart style={{ color: activeTab === tab ? 'white' : 'black' }} />}
                                {tab === 'Your Orders' && <FaClipboardList style={{ color: activeTab === tab ? 'white' : 'black' }} />}
                                {tab === 'Your Address' && <FaMapMarkerAlt style={{ color: activeTab === tab ? 'white' : 'black' }} />}
                                {tab}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Categories Grid / Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'All' && !selectedCategory && (
                        <motion.div 
                            key="CategoriesGrid"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            variants={containerVariants}
                        >
                            <Row className="justify-content-center">
                                {categories.map((category) => (
                                    <Col key={category.id} lg={3} md={6} sm={12} className="mb-4">
                                        <motion.div 
                                            variants={itemVariants} 
                                            className="h-100" 
                                            onClick={() => setSelectedCategory(category.slug)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="product-card">
                                                <div style={{ overflow: 'hidden' }}>
                                                    <img 
                                                        src={category.image || 'https://via.placeholder.com/150'} 
                                                        alt={category.name}
                                                        className="card-img-top"
                                                    />
                                                </div>
                                                <div className="card-content" style={{ textAlign: 'center' }}>
                                                    <h3 className="card-title">Fresh {category.name}</h3>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))}
                            </Row>
                        </motion.div>
                    )}

                    {activeTab === 'All' && selectedCategory && (
                         <motion.div 
                            key="CategoryDetails"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                         >
                            <CategoryPage fromHome={true} propSlug={selectedCategory} />
                         </motion.div>
                    )}

                    {activeTab === 'Wishlist' && (
                         <motion.div 
                            key="Wishlist"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                         >
                            <WishlistPage fromHome={true} />
                         </motion.div>
                    )}
                    {activeTab === 'Cart' && (
                        <motion.div 
                            key="Cart"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                         >
                            <CartPage fromHome={true} />
                        </motion.div>
                    )}
                    {activeTab === 'Your Orders' && (
                        <motion.div 
                            key="Orders"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <OrdersPage fromHome={true} />
                        </motion.div>
                    )}
                    {activeTab === 'Your Address' && (
                        <motion.div 
                            key="Address"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AddressPage fromHome={true} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </Container>

            {/* Why Choose Section */}
            {/* Why Choose Section */}
            {activeTab === 'All' && !selectedCategory && (
                <div className="py-5" style={{ backgroundColor: '#e9f2fbff' }}>
                    <Container>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold mb-2">Why Choose Ocean Market?</h2>
                            <p className="text-muted fs-5">We make it easy to enjoy fresh, quality seafood at home</p>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            {/* Card 1 */}
                            <div className="card border p-4 rounded-4 shadow-sm">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                                        <FaFish size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">Fresh Daily</h5>
                                        <p className="text-muted mb-0">All our seafood is sourced fresh daily from fish market</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="card border p-4 rounded-4 shadow-sm">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                                        <FaTruck size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">Home Delivery</h5>
                                        <p className="text-muted mb-0">Convenient delivery right to your doorstep with careful handling</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="card border p-4 rounded-4 shadow-sm">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                                        <FaClock size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">Flexible Timing</h5>
                                        <p className="text-muted mb-0">Choose your preferred delivery time that works for your schedule</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* Info Section */}
            {activeTab === 'All' && !selectedCategory && (
                <div className="py-4 mt-5" style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    <Container>
                        <div className="d-flex justify-content-center gap-5 flex-wrap">
                            <div className="d-flex align-items-center gap-2">
                                <FaTruck size={24} className="text-info" />
                                <span className="fs-5 fw-bold">Free Delivery Over $50</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <FaStore size={24} className="text-info" />
                                <span className="fs-5 fw-bold">In-Store Pickup Available</span>
                            </div>
                        </div>
                    </Container>
                </div>
            )}
        </AnimatedPage>
    );
};

export default Home;