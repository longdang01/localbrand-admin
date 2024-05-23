import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Space } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CreateStaffModal from './components/CreateStaffModal';
import StaffTable from './components/StaffTable';

const Staff = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'system',
    });

    const STAFF_BREADCRUMBS = [
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
                        {t('staff.meta_title') + ' / V-OSIN3-Plus'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={STAFF_BREADCRUMBS}
                title={t('staff.title')}
                children={
                    <Space align="center">
                        <CreateStaffModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <StaffTable />
        </>
    );
};

export default Staff;
