import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user";
import { toast } from "sonner";

export function useProfile() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: userApi.getProfile,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            toast.success("Профиль обновлен");
        },
        onError: () => toast.error("Ошибка при обновлении"),
    });
}

export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userApi.uploadAvatar,
        onSuccess: () => {
            // Сбрасываем кэш, чтобы профиль (и аватарка в хедере) обновились везде
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            toast.success("Фото профиля обновлено");
        },
        onError: (error: any) => {
            toast.error("Ошибка загрузки", {
                description: error.response?.data || "Не удалось загрузить изображение",
            });
        },
    });
}