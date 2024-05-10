import { MutationConfig } from "@/lib/react-query";
import { updateStaff } from "@/services/staff.service";
import { useMutation } from "react-query";

export const CACHE_STAFF = {
    UPDATE_STAFF: 'UPDATE_STAFF',
};

export const useUpdateStaff = ({
    config,
}: {
    config?: MutationConfig<typeof updateStaff>;
}) => {
    return useMutation({
        onMutate: () => {},
        onError: () => {},
        onSuccess: () => {},
        ...config,
        mutationFn: updateStaff,
    });
};
