import { useGetTotalOrder } from '@/loaders/statistics.loader';
import MiniCard from '@/modules/shared/statistics/mini-card/MiniCard';
import { useTranslation } from 'react-i18next';

const CardOrder = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

    const getTotalOrder = useGetTotalOrder({});

    return (
        <>
            <MiniCard
                loading={getTotalOrder?.isLoading}
                title={t('mini_card.order')}
                value={getTotalOrder?.data}
                cardClass="card-3"
            />
        </>
    );
};

export default CardOrder;
