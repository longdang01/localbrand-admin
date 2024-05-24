import { useGetTotalSales } from '@/loaders/statistics.loader';
import MiniCard from '@/modules/shared/statistics/mini-card/MiniCard';
import { useTranslation } from 'react-i18next';

const CardSales = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

    const getTotalSale = useGetTotalSales({});

    return (
        <>
            <MiniCard
                loading={getTotalSale?.isLoading}
                title={t('mini_card.sale')}
                value={getTotalSale?.data}
                cardClass="card-1"
            />
        </>
    );
};

export default CardSales;
