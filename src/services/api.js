import axios from 'axios';

const api = axios.create({
    baseURL: process.env.PORT
});

export default api;