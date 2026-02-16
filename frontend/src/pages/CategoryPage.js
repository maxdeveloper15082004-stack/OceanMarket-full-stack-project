import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaArrowLeft, FaPlus, FaHeart, FaShoppingCart, FaClipboardList, FaMapMarkerAlt } from 'react-icons/fa';
import { getProducts, addProduct, getCategories, deleteProduct, updateProduct, addToWishlist, getWishlist, removeFromWishlist, getCart, addToCart, removeFromCart } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import WishlistPage from './WishlistPage';
import CartPage from './CartPage';
import OrdersPage from './OrdersPage';
import AddressPage from './AddressPage';

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
        opacity: 1
    }
};

const CategoryPage = ({ fromHome, propSlug }) => {
    const { slug: paramSlug } = useParams();
    const slug = propSlug || paramSlug;
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        weight: '1 kg',
        stock: 10,
        description: '',
        image_file: null
    });

    const [editProductId, setEditProductId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [cartIds, setCartIds] = useState([]);

    const userEmail = localStorage.getItem('user_email');
    const isAdmin = userEmail === 'maxanmax@gmail.com';

    useEffect(() => {
        setLoading(true); // reset loading on slug change
        getCategories().then(res => {
            const currentCat = res.data.find(c => c.slug === slug);
            if (currentCat) setCategoryId(currentCat.id);
        }).catch(console.error);
        fetchProducts();
        fetchWishlist();
        fetchCart();
    }, [slug]);

    useEffect(() => {
        if (activeTab === 'All') fetchWishlist();
    }, [activeTab]);

    const fetchWishlist = () => {
        getWishlist()
            .then(response => {
                const products = response.data.products || [];
                const ids = products.map(p => p.id);
                setWishlistIds(ids);
            })
            .catch(err => console.error("Failed to fetch wishlist", err));
    };


    const handleToggleWishlist = async (product) => {
        if (wishlistIds.includes(product.id)) {
            try {
                await removeFromWishlist(product.id);
                setWishlistIds(prev => prev.filter(id => id !== product.id));
            } catch (error) {
                console.error("Failed to remove from wishlist", error);
            }
        } else {
            try {
                await addToWishlist(product.id);
                setWishlistIds(prev => [...prev, product.id]);
            } catch (error) {
                 console.error("Failed to add to wishlist", error);
            }
        }
    };

    const fetchProducts = () => {
        setLoading(true);
        getProducts()
            .then(response => {
                const filtered = response.data.filter(p => p.category.slug === slug);
                setProducts(filtered);
            })
            .catch(err => {
                console.error(err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!categoryId) return alert("Category not found");

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('weight', newProduct.weight);
        formData.append('stock', newProduct.stock);
        const slugStr = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        formData.append('slug', slugStr);
        formData.append('category_id', categoryId);
        formData.append('is_active', true);
        if (newProduct.image_file) {
            formData.append('image', newProduct.image_file);
        }

        try {
            if (editProductId) {
                await updateProduct(editProductId, formData);
            } else {
                await addProduct(formData);
            }
            setShowModal(false);
            setEditProductId(null);
            setNewProduct({ name: '', price: '', weight: '1 kg', stock: 10, description: '', image_file: null });
            fetchProducts();
        } catch (error) {
            console.error("Failed to save product", error);
            if (error.response && error.response.data) {
                alert(`Failed to save product: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Failed to save product");
            }
        }
    };

    const handleEditClick = (product) => {
        setEditProductId(product.id);
        setNewProduct({
            name: product.name,
            price: product.price,
            weight: product.weight,
            stock: product.stock,
            description: product.description || '',
            image_file: null // Don't pre-fill file input
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditProductId(null);
        setNewProduct({ name: '', price: '', weight: '1 kg', stock: 10, description: '', image_file: null });
        setShowModal(true);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                fetchProducts(); // Refresh list to remove deleted item
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
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

    return (
        <AnimatedPage>
            <div className={fromHome ? "" : "container mt-5"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {!fromHome && (
                        <Link to="/" className="text-decoration-none">
                            <div className="btn-back-home">
                                <FaArrowLeft /> BACK TO HOME
                            </div>
                        </Link>
                    )}
                    
                    {isAdmin && (
                        <Button 
                            variant="success" 
                            className="d-flex align-items-center gap-2"
                            onClick={openAddModal}
                            style={{ borderRadius: '50px', padding: '0.75rem 1.5rem', fontWeight: 800 }}
                        >
                            <FaPlus /> Add Product
                        </Button>
                    )}
                </div>

                {!fromHome && (
                    <div className="mb-4 d-flex justify-content-center">
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
                                    onClick={() => setActiveTab(tab)}
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
                )}


                <AnimatePresence mode="wait">
                    {(activeTab === 'All' || fromHome) && (
                        loading ? (
                            <div className="text-center py-5" style={{ minHeight: '50vh' }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                key="All"
                                initial={fromHome ? false : { x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                variants={fromHome ? {} : containerVariants}
                            >
                            <motion.h2 
                                className="mb-4 text-capitalize text-center"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                style={{ fontWeight: 800 }}
                            >
                                {slug === 'fish' ? 'All Kinds of Fishes' : `All Kinds of ${slug}`}
                            </motion.h2>
                            <Row>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <Col key={product.id} md={4} className="mb-4">
                                            <motion.div variants={itemVariants}>
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
                                                            onClick={() => handleToggleWishlist(product)}
                                                        >
                                                            <FaHeart style={{ color: wishlistIds.includes(product.id) ? 'red' : 'black' }} />
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

                                                        {isAdmin && (
                                                            <div className="d-flex gap-2 mt-3 pt-3 border-top">
                                                                <Button variant="outline-primary" size="sm" className="flex-fill" onClick={() => handleEditClick(product)}>Edit</Button>
                                                                <Button variant="outline-danger" size="sm" className="flex-fill" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </Col>
                                    ))
                                ) : (
                                    <motion.p variants={itemVariants} className="text-muted text-center w-100">No products found in this category.</motion.p>
                                )}
                            </Row>
                        </motion.div>
                    )
                )}

                    {!fromHome && activeTab === 'Wishlist' && (
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
                    {!fromHome && activeTab === 'Cart' && (
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
                    {!fromHome && activeTab === 'Your Orders' && (
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
                    {!fromHome && activeTab === 'Your Address' && (
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

                {/* Add/Edit Product Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editProductId ? 'Edit Product' : `Add New ${slug}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSaveProduct}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    required 
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price (₹)</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            required 
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Select 
                                            value={newProduct.weight}
                                            onChange={e => setNewProduct({...newProduct, weight: e.target.value})}
                                        >
                                            <option value="1/2 kg">1/2 kg</option>
                                            <option value="1 kg">1 kg</option>
                                            <option value="1 1/2 kg">1 1/2 kg</option>
                                            <option value="2 kg">2 kg</option>
                                            <option value="2 1/2 kg">2 1/2 kg</option>
                                            <option value="3 kg">3 kg</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Stock Status</Form.Label>
                                <Form.Select 
                                    value={newProduct.stock > 0 ? 'in_stock' : 'out_of_stock'}
                                    onChange={e => setNewProduct({...newProduct, stock: e.target.value === 'in_stock' ? 10 : 0})}
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Image</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    required={!editProductId}
                                    accept="image/*"
                                    onChange={e => setNewProduct({...newProduct, image_file: e.target.files[0]})}
                                />
                                {editProductId && <Form.Text className="text-muted">Leave blank to keep current image</Form.Text>}
                            </Form.Group>
                            
                            <Button variant="primary" type="submit" className="w-100">
                                {editProductId ? 'Update Product' : 'Create Product'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </AnimatedPage>
    );
};

export default CategoryPage;
