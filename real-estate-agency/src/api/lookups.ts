import { api } from "@/lib/axios";

export interface LookupItem {
    id: number;
    name: string;
}

export interface AllLookups {
    districts: LookupItem[];
    propertyTypes: LookupItem[];
    operationTypes: LookupItem[];
}

export const lookupsApi = {
    getAll: async (): Promise<AllLookups> => {
        const { data } = await api.get("/lookups");
        return data;
    }
};