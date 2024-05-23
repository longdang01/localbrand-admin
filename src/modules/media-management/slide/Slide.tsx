import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateSlideModal from './components/CreateSlideModal';
import SlideTable from './components/SlideTable';

const Slide = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'media',
    });

    const SLIDE_BREADCRUMBS = [
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
                        {t('slide.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={SLIDE_BREADCRUMBS}
                title={t('slide.title')}
                children={
                    <Space align="center">
                        <CreateSlideModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <SlideTable />
        </>
    );
};

export default Slide;
