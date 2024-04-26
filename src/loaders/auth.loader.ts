import {
    ExtractFnReturnType,
    MutationConfig,
    QueryConfig,
} from '@/lib/react-query';
import { changePassword, getMe, login } from '@/services/user.service';
import { AxiosRequestConfig } from 'axios';
import { useMutation, useQuery } from 'react-query';

export const CACHE_AUTH = {
    AUTH_LOGIN: 'AUTH_LOGIN',
    AUTH_ME: 'AUTH_ME',
};

export const useLogin = ({
    config,
}: {
    config?: MutationConfig<typeof login>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: login,
    });
};

export const useGetMe = ({
    params,
    config,
    enabled,
}: {
    params?: AxiosRequestConfig['params'];
    config?: QueryConfig<typeof getMe>;
    enabled?: boolean;
}) => {
    return useQuery<ExtractFnReturnType<typeof getMe>>({
        ...config,
        queryKey: [CACHE_AUTH.AUTH_ME, params],
        queryFn: () => getMe(),
        enabled: enabled
    });
};

export const useChangePassword = ({
    config,
}: {
    config?: MutationConfig<typeof changePassword>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: changePassword,
    });
};