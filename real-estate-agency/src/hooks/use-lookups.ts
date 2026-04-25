import { useQuery } from "@tanstack/react-query";
import { lookupsApi } from "@/api/lookups";

export function useLookups() {
    return useQuery({
        queryKey: ["lookups"],
        queryFn: lookupsApi.getAll,
        staleTime: 1000 * 60 * 60, // Справочники меняются редко, кэшируем на час
    });
}