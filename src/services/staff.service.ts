import { apiClient } from "@/lib/api";
import { StaffProps } from "@/models/staff";

const prefix = "staffs";
    
export const updateStaff = async (request: StaffProps) => {
    const response = await apiClient?.put(`${prefix}/${request?._id}`, request);
    return response.data;
};