import {
    ExtractFnReturnType,
    MutationConfig,
    QueryConfig,
} from '@/lib/react-query';
import {
    getTotalSale,
    getTotalProduct,
    getTotalCustomer,
    getTotalOrder,
    getTotalSpending,
    getRevenue,
} from '@/services/statistics.service';
import { AxiosRequestConfig } from 'axios';
import { useMutation, useQuery } from 'react-query';

export const CACHE_STATISTICS = {
    TOTAL_SALES: 'TOTAL_SALES',
    TOTAL_PRODUCT: 'TOTAL_PRODUCT',
    TOTAL_CUSTOMER: 'TOTAL_CUSTOMER',
    TOTAL_ORDER: 'TOTAL_ORDER',
    TOTAL_SPENDING: 'TOTAL_SPENDING',
    TOTAL_REVENUE: 'TOTAL_REVENUE',
};

export const useGetTotalSales = ({
    config,
}: {
    config?: QueryConfig<typeof getTotalSale>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getTotalSale>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_SALES],
        queryFn: () => getTotalSale(),
    });
};

export const useGetTotalProduct = ({
    config,
}: {
    config?: QueryConfig<typeof getTotalProduct>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getTotalProduct>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_PRODUCT],
        queryFn: () => getTotalProduct(),
    });
};

export const useGetTotalCustomer = ({
    config,
}: {
    config?: QueryConfig<typeof getTotalCustomer>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getTotalCustomer>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_CUSTOMER],
        queryFn: () => getTotalCustomer(),
    });
};

export const useGetTotalOrder = ({
    config,
}: {
    config?: QueryConfig<typeof getTotalOrder>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getTotalOrder>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_ORDER],
        queryFn: () => getTotalOrder(),
    });
};

export const useGetTotalSpending = ({
    config,
}: {
    config?: QueryConfig<typeof getTotalSpending>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getTotalSpending>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_SPENDING],
        queryFn: () => getTotalSpending(),
    });
};

export const useGetTotalRevenue = ({
    config,
}: {
    config?: QueryConfig<typeof getRevenue>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getRevenue>>({
        ...config,
        queryKey: [CACHE_STATISTICS.TOTAL_REVENUE],
        queryFn: () => getRevenue(),
    });
};
