import { api } from "@/lib/axios";
import { LoginValues, RegisterValues } from "@/lib/validations/auth";

export interface AuthResponse {
    token: string;
    email: string;
    roles: string[];
}

export const authApi = {
    login: async (values: LoginValues): Promise<AuthResponse> => {
        const { data } = await api.post("/auth/login", values);
        return data;
    },
    register: async (values: RegisterValues) => {
        // Убираем confirmPassword перед отправкой на бэкенд
        const { confirmPassword, ...registerData } = values;
        const { data } = await api.post("/auth/register-client", registerData);
        return data;
    },
};