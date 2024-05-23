import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateLookbookModal from './components/CreateLookbookModal';
import LookbookTable from './components/LookbookTable';

const Lookbook = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'media',
    });

    const LOOKBOOK_BREADCRUMBS = [
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
                        {t('lookbook.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={LOOKBOOK_BREADCRUMBS}
                title={t('lookbook.title')}
                children={
                    <Space align="center">
                        <CreateLookbookModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <LookbookTable />
        </>
    );
};

export default Lookbook;
