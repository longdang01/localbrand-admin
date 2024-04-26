import { MutationConfig } from '@/lib/react-query';
import { updateProfile } from '@/services/user.service';
import { useMutation } from 'react-query';

export const CACHE_USERS = {
    USERS_PROFILE: 'USERS_PROFILE',
};

export const useUpdateProfile = ({
    config,
}: {
    config?: MutationConfig<typeof updateProfile>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: updateProfile,
    });
};
