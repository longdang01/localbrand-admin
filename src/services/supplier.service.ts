import { apiClient } from "@/lib/api";
import { SupplierProps } from "@/models/supplier";
import { AxiosRequestConfig } from "axios";

const prefix = "suppliers";

export const search = async (request: AxiosRequestConfig['params']) => {
    const response = await apiClient?.post(`${prefix}/search`, request);
    return response.data;
};

export const getById = async (id: string) => {
    const response = await apiClient?.get(`${prefix}/${id}`);
    return response.data;
};

export const create = async (request: SupplierProps) => {
    const response = await apiClient?.post(`${prefix}`, request);
    return response.data;
};

export const update = async (id: string, request: SupplierProps) => {
    const response = await apiClient?.put(`${prefix}/${id}`, request);
    return response.data;
};

export const remove = async (id: string) => {
    const response = await apiClient?.delete(`${prefix}/${id}`);
    return response.data;
};