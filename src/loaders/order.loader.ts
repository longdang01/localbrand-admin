import { ExtractFnReturnType, MutationConfig, QueryConfig } from "@/lib/react-query";
import { create, getByCode, getById, remove, search, update } from "@/services/order.service";
import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

export const CACHE_ORDER = {
    SEARCH: 'SEARCH_ORDER',
    GET_BY_ID: 'GET_BY_ID_ORDER',
    GET_BY_CODE: 'GET_BY_CODE_ORDER',
    CREATE: 'CREATE_ORDER',
    UPDATE: 'UPDATE_ORDER',
    REMOVE: 'REMOVE_ORDER',
};

export const useSearchOrders = ({
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
        queryKey: [CACHE_ORDER.SEARCH, params],
        queryFn: () => search({ ...params }),
        enabled: enabled
    });
};

export const useGetByIdOrder = ({
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
        queryKey: [CACHE_ORDER.GET_BY_ID, id],
        queryFn: () => getById(id),
        enabled: enabled
    });
};

export const useGetByCodeOrder = ({
    params,
    config,
}: {
    params: AxiosRequestConfig['params'];
    config?: QueryConfig<typeof getByCode>;
}) => {
    return useQuery<ExtractFnReturnType<typeof getByCode>>({
        ...config,
        queryKey: [CACHE_ORDER.GET_BY_CODE, params],
        queryFn: () => getByCode({ ...params }),
    });
};


export const useCreateOrder = ({
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

export const useUpdateOrder = ({
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

export const useRemoveOrder = ({
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