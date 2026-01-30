import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (email, password, userType) => {
        const response = await api.post('/auth/login', { email, password, userType });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    registerPatient: async (userData) => {
        const response = await api.post('/auth/register/patient', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    registerProvider: async (userData) => {
        const response = await api.post('/auth/register/provider', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Patient services
export const patientService = {
    getAllPatients: async () => {
        const response = await api.get('/patients');
        return response.data;
    },

    getPatientById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    updatePatient: async (id, patientData) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
    },

    updateVitals: async (id, vitalsData) => {
        const response = await api.put(`/patients/${id}/vitals`, vitalsData);
        return response.data;
    },

    addMedicalHistory: async (id, historyData) => {
        const response = await api.post(`/patients/${id}/medical-history`, historyData);
        return response.data;
    },
};

// Provider services
export const providerService = {
    getProviderProfile: async (id) => {
        const response = await api.get(`/providers/${id}`);
        return response.data;
    },

    getAssignedPatients: async (id) => {
        const response = await api.get(`/providers/${id}/patients`);
        return response.data;
    },

    updateProviderProfile: async (id, profileData) => {
        const response = await api.put(`/providers/${id}/profile`, profileData);
        return response.data;
    },
};

export default api;
