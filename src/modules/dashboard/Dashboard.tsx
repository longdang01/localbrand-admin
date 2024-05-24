import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PageHeader from '../shared/page-header/Pageheader';
import DashboardArea from './components/DashboardArea';

const Dashboard = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'dashboard',
    });

    const DASHBOARD_BREADCRUMBS = [
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
                        {t('meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={DASHBOARD_BREADCRUMBS}
                title={t('title')}
                isContainTitle={true}
            />

            <DashboardArea />
        </>
    );
};

export default Dashboard;
