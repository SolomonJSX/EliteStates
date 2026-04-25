import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';
import {API_URL} from "@/lib/config"; // Импортируй свой стор

export const api = axios.create({
    baseURL: `${API_URL}/api`, // Добавляем /api к базовому адресу
});

api.interceptors.request.use((config) => {
    // Берем актуальное состояние из Zustand напрямую (без хука)
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});