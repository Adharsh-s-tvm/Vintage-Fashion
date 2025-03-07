import { api } from '../../lib/api';
import axios from 'axios';

const API_URL = `${api}/admin`;

export const loginAdmin = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            { withCredentials: true }
        );

        // If the token is in the response body but not automatically saved as a cookie
        if (response.data && !response.data.token) {
            // Extract token from cookies if it's not in the response data
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
            if (tokenCookie) {
                const token = tokenCookie.split('=')[1];
                // Add token to the response data
                response.data.token = token;
            }
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutAdmin = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            { withCredentials: true }
        );

        // Clear local storage
        localStorage.removeItem('userInfo');
        localStorage.removeItem('jwt');

        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getDashboard = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/dashboard`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Dashboard fetch error:', error);
        throw error;
    }
};