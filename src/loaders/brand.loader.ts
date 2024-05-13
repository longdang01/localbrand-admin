import { ExtractFnReturnType, MutationConfig, QueryConfig } from "@/lib/react-query";
import { create, getById, remove, search, update } from "@/services/brand.service";
import { AxiosRequestConfig } from "axios";
import { useMutation, useQuery } from "react-query";

export const CACHE_BRAND = {
    SEARCH: 'SEARCH',
    GET_BY_ID: 'GET_BY_ID',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    REMOVE: 'REMOVE',
};

export const useSearchBrands = ({
    params,
    config,
}: {
    params: AxiosRequestConfig['params'];
    config?: QueryConfig<typeof search>;
}) => {
    return useQuery<ExtractFnReturnType<typeof search>>({
        ...config,
        queryKey: [CACHE_BRAND.SEARCH, params],
        queryFn: () => search({ ...params }),
    });
};

export const useGetByIdBrand = ({
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
        queryKey: [CACHE_BRAND.GET_BY_ID, id],
        queryFn: () => getById(id),
        enabled: enabled
    });
};

export const useCreateBrand = ({
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

export const useUpdateBrand = ({
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

export const useRemoveBrand = ({
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