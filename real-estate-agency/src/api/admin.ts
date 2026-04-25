import { api } from "@/lib/axios";

export const adminApi = {
    registerEmployee: async (data: any, avatarFile: File | null) => {
        const formData = new FormData();
        
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("phone", data.phone);
        formData.append("position", data.position);
        
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        const res = await api.post("/admin/employees", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    }
};