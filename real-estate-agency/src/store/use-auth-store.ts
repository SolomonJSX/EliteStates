import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    email: string | null;
    roles: string[];
    setAuth: (data: { token: string; email: string; roles: string[] }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            email: null,
            roles: [],
            setAuth: (data) => set({
                token: data.token,
                email: data.email,
                roles: data.roles
            }),
            logout: () => set({ token: null, email: null, roles: [] }),
        }),
        {
            name: 'auth-storage', // Ключ в localStorage (Zustand сам всё сохранит)
        }
    )
);