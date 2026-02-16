import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getProducts = () => api.get('products/products/');
export const getCategories = () => api.get('products/categories/');
export const getCart = () => api.get('orders/cart/');
export const addToCart = (data) => api.post('orders/cart/add-item/', data);
export const removeFromCart = (product_id) => api.post('orders/cart/remove-item/', { product_id });
export const addProduct = (data) => api.post('products/products/', data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteProduct = (id) => api.delete(`products/products/${id}/`);
export const updateProduct = (id, data) => api.patch(`products/products/${id}/`, data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const getWishlist = () => api.get('orders/wishlist/');
export const addToWishlist = (product_id) => api.post('orders/wishlist/add-item/', { product_id });
export const removeFromWishlist = (product_id) => api.post('orders/wishlist/remove-item/', { product_id });
export const login = (credentials) => api.post('token/', credentials);

export default api;
