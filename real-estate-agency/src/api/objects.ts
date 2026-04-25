// src/api/objects.ts
import { api } from "@/lib/axios";

// ... (CreateObjectResponse, createObject)

export const objectsApi = {
    // ... createObject,

    uploadPhotos: async (objectId: number, files: File[]) => {
        const formData = new FormData();
        // Важно: ключ "files" должен совпадать с именем аргумента в контроллере .NET [IFormFile[] files]
        files.forEach((file) => formData.append("files", file));

        const { data } = await api.post(`/objects/${objectId}/photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
    getListing: async (params: any) => {
        const { data } = await api.get("/objects", { params });
        return data;
    },
    getById: async (id: number) => {
        const { data } = await api.get(`/objects/${id}`);
        return data;
    },
    getMyObjects: async () => {
        const { data } = await api.get("/objects/my");
        return data;
    },

    deleteObject: async (id: number) => {
        const { data } = await api.delete(`/objects/${id}`);
        return data;
    },
    getPendingObjects: async () => {
        const { data } = await api.get("/objects/pending");
        return data;
    },

    changeStatus: async (id: number, status: string) => {
        const { data } = await api.patch(`/objects/${id}/status`, { status });
        return data;
    },
};