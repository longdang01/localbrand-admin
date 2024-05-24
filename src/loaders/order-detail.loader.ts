import { ExtractFnReturnType, MutationConfig, QueryConfig } from "@/lib/react-query";
import { create, getById, remove, search, update } from "@/services/order-detail.service";
import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

export const CACHE_ORDER_DETAIL = {
    SEARCH: 'SEARCH_ORDER_DETAIL',
    GET_BY_ID: 'GET_BY_ID_ORDER_DETAIL',
    CREATE: 'CREATE_ORDER_DETAIL',
    UPDATE: 'UPDATE_ORDER_DETAIL',
    REMOVE: 'REMOVE_ORDER_DETAIL',
};

export const useSearchOrderDetails = ({
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
        queryKey: [CACHE_ORDER_DETAIL.SEARCH, params],
        queryFn: () => search({ ...params }),
        enabled: enabled
    });
};

export const useGetByIdOrderDetail = ({
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
        queryKey: [CACHE_ORDER_DETAIL.GET_BY_ID, id],
        queryFn: () => getById(id),
        enabled: enabled
    });
};

export const useCreateOrderDetail = ({
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

export const useUpdateOrderDetail = ({
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

export const useRemoveOrderDetail = ({
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