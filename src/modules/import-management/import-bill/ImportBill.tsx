import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Button, Space, Tooltip } from 'antd';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import ImportBillTable from './components/ImportBillTable';
import { useNavigate } from 'react-router-dom';
import { IMPORT_BILL_CREATE_PATH } from '@/paths';

const ImportBill = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const navigate = useNavigate();

    const INVOICE_BREADCRUMBS = [
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
                        {t('invoice.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={INVOICE_BREADCRUMBS}
                title={t('invoice.title')}
                children={
                    <Space align="center">
                        <Tooltip title={t('invoice.create')}>
                            <Button type="primary" onClick={() => navigate(IMPORT_BILL_CREATE_PATH)}>
                                {t('invoice.create')}
                            </Button>
                        </Tooltip>
                    </Space>
                }
                isContainTitle={true}
            />

            <ImportBillTable />
        </>
    );
};

export default ImportBill;
