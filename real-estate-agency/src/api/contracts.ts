import { api } from "@/lib/axios";

export const contractsApi = {
    // Получаем только те объекты, которые можно продать/сдать
    getActiveObjects: async () => {
        const { data } = await api.get("/objects", { params: { pageSize: 100 } }); 
        // В идеале на бэкенде добавить фильтр Status=Active, пока фильтруем на фронте
        return data.items.filter((obj: any) => obj.status === "Active");
    },

    // Список всех клиентов агентства
    getClients: async () => {
        const { data } = await api.get("/clients"); // Убедись, что этот эндпоинт готов
        return data;
    },

    // Типы операций (Продажа/Аренда)
    getOperationTypes: async () => {
        // Если нет эндпоинта, можно захардкодить или создать справочник
        return [
            { id: 1, name: "Продажа" },
            { id: 2, name: "Аренда" }
        ];
    },

    create: async (payload: any) => {
        const { data } = await api.post("/contracts", payload);
        return data;
    }
};