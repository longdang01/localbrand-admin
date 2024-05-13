import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateCollectionModal from './components/CreateCollectionModal';
import CollectionTable from './components/CollectionTable';

const Collection = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const COLLECTION_BREADCRUMBS = [
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
                        {t('collection.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={COLLECTION_BREADCRUMBS}
                title={t('collection.title')}
                children={
                    <Space align="center">
                        <CreateCollectionModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <CollectionTable />
        </>
    );
};

export default Collection;
