import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateBrandModal from './components/CreateBrandModal';
import BrandTable from './components/BrandTable';

const Brand = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const BRAND_BREADCRUMBS = [
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
                        {t('brand.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={BRAND_BREADCRUMBS}
                title={t('brand.title')}
                children={
                    <Space align="center">
                        <CreateBrandModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <BrandTable />
        </>
    );
};

export default Brand;
