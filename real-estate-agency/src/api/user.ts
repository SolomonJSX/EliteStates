import { api } from "@/lib/axios";

export interface UserProfile {
    id: string;
    email: string;
    avatarUrl: string | null;
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    role: string;
    city?: string;
    street?: string;
    house?: string;
}

export const userApi = {
    getProfile: async (): Promise<UserProfile> => {
        const { data } = await api.get("/user/profile");
        return data;
    },
    updateProfile: async (values: any) => {
        const { data } = await api.put("/user/profile", values);
        return data;
    },
    uploadAvatar: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file); // Имя "file" должно совпадать с аргументом в [IFormFile file] на бэкенде

        const { data } = await api.post("/user/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
};