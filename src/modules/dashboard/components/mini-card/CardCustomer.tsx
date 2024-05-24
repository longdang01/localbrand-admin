import { useGetTotalCustomer } from '@/loaders/statistics.loader';
import MiniCard from '@/modules/shared/statistics/mini-card/MiniCard';
import { useTranslation } from 'react-i18next';

const CardCustomer = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

    const getTotalCustomer = useGetTotalCustomer({});

    return (
        <>
            <MiniCard
                loading={getTotalCustomer?.isLoading}
                title={t('mini_card.customer')}
                value={getTotalCustomer?.data}
                cardClass="card-4"
            />
        </>
    );
};

export default CardCustomer;
