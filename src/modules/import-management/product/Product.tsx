import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateProductModal from './components/CreateProductModal';
import ProductTable from './components/ProductTable';

const Product = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const PRODUCT_BREADCRUMBS = [
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
                        {t('product.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={PRODUCT_BREADCRUMBS}
                title={t('product.title')}
                children={
                    <Space align="center">
                        <CreateProductModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <ProductTable />
        </>
    );
};

export default Product;
