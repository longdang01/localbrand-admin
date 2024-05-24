import { apiClient } from '@/lib/api';

const prefix = 'statics';

export const getTotalSale = async () => {
    const response = await apiClient?.get(`${prefix}/get-total-product-sales`);
    return response.data;
};

export const getTotalProduct = async () => {
    const response = await apiClient?.get(`${prefix}/get-total-products`);
    return response.data;
};

export const getTotalCustomer = async () => {
    const response = await apiClient?.get(`${prefix}/get-total-customers`);
    return response.data;
};

export const getTotalOrder = async () => {
    const response = await apiClient?.get(`${prefix}/get-total-orders`);
    return response.data;
};

export const getTotalSpending = async () => {
    const response = await apiClient?.get(`${prefix}/get-total-spending`);
    return response.data;
};

export const getRevenue = async () => {
    const response = await apiClient?.get(`${prefix}/get-revenue`);
    return response.data;
};
