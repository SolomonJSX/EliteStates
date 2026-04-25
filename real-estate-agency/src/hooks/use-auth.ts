import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {useAuthStore} from "@/store/use-auth-store"; // Импортируем из sonner

export function useAuth() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Zustand сам сохранит это в localStorage благодаря middleware persist
            setAuth({
                token: data.token,
                email: data.email,
                roles: data.roles
            });

            toast.success("С возвращением!");
            router.push("/");
        },
        onError: (error: any) => {
            toast.error("Ошибка входа", {
                description: error.response?.data?.message || "Неверный логин или пароль",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast.success("Регистрация успешна!", {
                description: "Теперь вы можете войти в свой аккаунт.",
            });
            router.push("/login");
        },
        onError: (error: any) => {
            toast.error("Ошибка регистрации", {
                description: error.response?.data?.message || "Не удалось создать аккаунт",
            });
        },
    });

    return {
        login: loginMutation,
        register: registerMutation,
        isLoading: loginMutation.isPending || registerMutation.isPending,
    };
}