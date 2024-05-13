import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateCategoryBigModal from './components/CreateCategoryBigModal';
import CategoryBigTable from './components/CategoryBigTable';

const CategoryBig = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const CATEGORY_BIG_BREADCRUMBS = [
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
                        {t('category_big.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={CATEGORY_BIG_BREADCRUMBS}
                title={t('category_big.title')}
                children={
                    <Space align="center">
                        <CreateCategoryBigModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <CategoryBigTable />
        </>
    );
};

export default CategoryBig;
