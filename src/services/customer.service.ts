import { apiClient } from "@/lib/api";
import { CustomerProps } from "@/models/customer";
import { AxiosRequestConfig } from "axios";

const prefix = "customers";

export const search = async (request: AxiosRequestConfig['params']) => {
    const response = await apiClient?.post(`${prefix}/search`, request);
    return response.data;
};

export const getById = async (id: string) => {
    const response = await apiClient?.get(`${prefix}/${id}`);
    return response.data;
};

export const create = async (request: CustomerProps) => {
    const response = await apiClient?.post(`${prefix}`, request);
    return response.data;
};

export const update = async (id: string, request: CustomerProps) => {
    const response = await apiClient?.put(`${prefix}/${id}`, request);
    return response.data;
};

export const remove = async (id: string) => {
    const response = await apiClient?.delete(`${prefix}/${id}`);
    return response.data;
};