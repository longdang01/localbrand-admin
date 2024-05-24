import { useGetMe } from '@/loaders/auth.loader';
import { NotAuthorizationPage } from '@/modules/errors/403';
import { useEffect } from 'react';

interface Props {
    roles: (string | number)[];
    children: React.ReactNode;
}
const RoleGuard = ({ roles, children }: Props) => {
    const currentUser = useGetMe({});

    const onNavigate = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        onNavigate();
    }, [window.location.pathname]);

    if (
        !currentUser?.isLoading &&
        !roles?.includes(Number(currentUser?.data?.user?.role))
    )
        return <NotAuthorizationPage />;

    return <>{children}</>;
};

export default RoleGuard;
