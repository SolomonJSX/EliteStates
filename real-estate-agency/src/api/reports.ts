import { api } from "@/lib/axios";

export const reportsApi = {
    getIncomeByEmployee: () => api.get("/reports/income-by-employee"),
    getObjectsByDistrict: () => api.get("/reports/objects-count-by-district"),
    getOwnersByOperation: (id: number) => api.get(`/reports/owners-by-operation/${id}`),
    getFinancialReport: (date: string, empId: number) => 
        api.get(`/reports/financial-report?date=${date}&employeeId=${empId}`),
    getPropertyTypesByOp: (opId: number) => 
        api.get(`/reports/property-types-by-operation?operationTypeId=${opId}`),
};