import { ExtractFnReturnType, MutationConfig, QueryConfig } from "@/lib/react-query";
import { create, getById, remove, search, update } from "@/services/discount.service";
import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

export const CACHE_DISCOUNT = {
    SEARCH: 'SEARCH_DISCOUNT',
    GET_BY_ID: 'GET_BY_ID_DISCOUNT',
    CREATE: 'CREATE_DISCOUNT',
    UPDATE: 'UPDATE_DISCOUNT',
    REMOVE: 'REMOVE_DISCOUNT',
};

export const useSearchDiscounts = ({
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
        queryKey: [CACHE_DISCOUNT.SEARCH, params],
        queryFn: () => search({ ...params }),
        enabled: enabled
    });
};

export const useGetByIdDiscount = ({
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
        queryKey: [CACHE_DISCOUNT.GET_BY_ID, id],
        queryFn: () => getById(id),
        enabled: enabled
    });
};

export const useCreateDiscount = ({
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

export const useUpdateDiscount = ({
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

export const useRemoveDiscount = ({
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