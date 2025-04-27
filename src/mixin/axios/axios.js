// src/plugins/axios.js
import axios from 'axios';
import {Stores_Auth} from "@/stores/auth/auth";

// ایجاد instance سفارشی
const axiosInstance = axios.create({
    baseURL:  import.meta.env.VITE_API_URL, // آدرس پایه از .env
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// اضافه کردن interceptors (اختیاری)
axiosInstance.interceptors.request.use(
    (config) => {
        // مثلاً اضافه کردن توکن به هدر
        const token = Stores_Auth().AuthGetToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // مدیریت خطاهای سرور
        if (error.response?.status === 401) {
            Stores_Auth().AuthLogout()
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;