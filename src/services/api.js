import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("adminToken");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        // IMPORTANT:
        // Do NOT force JSON Content-Type for FormData
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
            delete config.headers["content-type"];
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default API;