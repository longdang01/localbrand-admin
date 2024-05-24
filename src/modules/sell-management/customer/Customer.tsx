import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CustomerTable from './components/CustomerTable';

const Customer = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'sell',  
    });

    const CUSTOMER_BREADCRUMBS = [
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
                        {t('customer.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={CUSTOMER_BREADCRUMBS}
                title={t('customer.title')}
                isContainTitle={true}
            />

            <CustomerTable />
        </>
    );
};

export default Customer;
