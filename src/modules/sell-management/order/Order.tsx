import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Button, Space, Tooltip } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ORDER_CREATE_PATH } from '@/paths';
import OrderTable from './components/OrderTable';

const Order = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'sell',
    });

    const navigate = useNavigate();

    const ORDER_BREADCRUMBS = [
        {
            title: <span>{t('title')}</span>,
        },
    ];

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <meta charSet="UTF-8" />
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <meta name="theme-color" content="#000000" />
                    <title>
                        {t('order.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={ORDER_BREADCRUMBS}
                title={t('order.title')}
                children={
                    <Space align="center">
                        <Tooltip title={t('order.create')}>
                            <Button type="primary" onClick={() => navigate(ORDER_CREATE_PATH)}>
                                {t('order.create')}
                            </Button>
                        </Tooltip>
                    </Space>
                }
                isContainTitle={true}
            />

            <OrderTable />
        </>
    );
};

export default Order;
