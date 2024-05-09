import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const DataCatalog = () => {
    const { t } = useTranslation('translation', { keyPrefix: "data_warehouse"});

    return (
        <>
            <PageHeader
                title={t('catalog.title')}
                children={
                    <Space align="center">
                        <Button>New template</Button>
                        <Button type="primary">New project</Button>
                    </Space>
                }
                isContainTitle={true}
            />
        </>
    );
};

export default DataCatalog;
