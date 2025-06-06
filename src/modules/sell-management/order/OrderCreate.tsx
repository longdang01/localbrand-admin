import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import OrderCreateForm from './components/create/OrderCreateForm';

const OrderCreate = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'sell',
    });

    const ORDER_CREATE_BREADCRUMBS = [
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
                pageBreadcrumbs={ORDER_CREATE_BREADCRUMBS}
                title={t('order.title_create')}
                children={
                    <Space align="center">
                        {/* <CreateBrandModal /> */}
                    </Space>
                }
                isContainTitle={true}
            />

            <OrderCreateForm />

        </>
    );
};

export default OrderCreate;
