import { ExtractFnReturnType, MutationConfig, QueryConfig } from "@/lib/react-query";
import { create, getById, remove, search, update } from "@/services/customer.service";
import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

export const CACHE_CUSTOMER = {
    SEARCH: 'SEARCH_CUSTOMER',
    GET_BY_ID: 'GET_BY_ID_CUSTOMER',
    CREATE: 'CREATE_CUSTOMER',
    UPDATE: 'UPDATE_CUSTOMER',
    REMOVE: 'REMOVE_CUSTOMER',
};

export const useSearchCustomers = ({
    params,
    config,
    enabled
}: {
    params: AxiosRequestConfig['params'];
    config?: QueryConfig<typeof search>;
    enabled?: boolean;
}) => {
    return useQuery<ExtractFnReturnType<typeof search>>({
        ...config,
        queryKey: [CACHE_CUSTOMER.SEARCH, params],
        queryFn: () => search({ ...params }),
        enabled: enabled
    });
};

export const useGetByIdCustomer = ({
    id,
    config,
    enabled,
}: {
    id: string
    config?: QueryConfig<typeof getById>;
    enabled?: boolean;
}) => {
    return useQuery<ExtractFnReturnType<typeof getById>>({
        ...config,
        queryKey: [CACHE_CUSTOMER.GET_BY_ID, id],
        queryFn: () => getById(id),
        enabled: enabled
    });
};

export const useCreateCustomer = ({
    config,
}: {
    config?: MutationConfig<typeof create>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: create,
    });
};

export const useUpdateCustomer = ({
    id,
    config,
}: {
    id: string,
    config?: MutationConfig<typeof update>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: (request: any) => update(id, request),
    });
};

export const useRemoveCustomer = ({
    config,
}: {
    config?: MutationConfig<typeof remove>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: (id: string) => remove(id),
    });
};