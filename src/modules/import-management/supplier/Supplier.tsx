import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateSupplierModal from './components/CreateSupplierModal';
import SupplierTable from './components/SupplierTable';

const Supplier = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const SUPPLIER_BREADCRUMBS = [
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
                        {t('supplier.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={SUPPLIER_BREADCRUMBS}
                title={t('supplier.title')}
                children={
                    <Space align="center">
                        <CreateSupplierModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <SupplierTable />
        </>
    );
};

export default Supplier;
