import { useGetTotalProduct } from '@/loaders/statistics.loader';
import MiniCard from '@/modules/shared/statistics/mini-card/MiniCard';
import { useTranslation } from 'react-i18next';

const CardProduct = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

    const getTotalProduct = useGetTotalProduct({});

    return (
        <>
            <MiniCard
                loading={getTotalProduct?.isLoading}
                title={t('mini_card.product')}
                value={getTotalProduct?.data}
                cardClass="card-2"
            />
        </>
    );
};

export default CardProduct;
