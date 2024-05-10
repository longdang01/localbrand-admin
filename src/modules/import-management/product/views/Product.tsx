import PageHeader from '@/modules/shared/page-header/Pageheader';
import TableRender from '@/modules/shared/table-render/TableRender';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import {
    Button,
    Flex,
    Input,
    Space,
    TableColumnsType,
    Tooltip,
    Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { DATA_CATALOGS } from '../constants/product.constants';
import { DataCatalogProps } from '@/models/data-catalog';
import { PAGE_INDEX, PAGE_SIZE } from '@/constants/config';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import EditProductModal from '../components/EditProductModal';
import CreateProductModal from '../components/CreateProductModal';

const { Search } = Input;

const DataCatalog = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'data_warehouse',
    });

    const handleSearch = () => {};

    const catalogBreadcrumbs = [
        {
            title: <span>{t('title')}</span>,
        },
    ];

    const DATA_CATALOG_COLUMNS: TableColumnsType<DataCatalogProps> = [
        {
            title: t('catalog.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(PAGE_INDEX) - 1) * Number(PAGE_SIZE) + index + 1,
        },
        {
            title: t('catalog.fields.catalog_name'),
            dataIndex: 'catalog_name',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.catalog_name - b?.catalog_name,
            },
        },
        {
            title: t('catalog.fields.catalog_description'),
            dataIndex: 'catalog_description',
            sorter: {
                compare: (a: any, b: any) =>
                    a?.catalog_description - b?.catalog_description,
            },
        },
        {
            title: t('catalog.fields.sort_order'),
            dataIndex: 'sort_order',
            sorter: {
                compare: (a: any, b: any) => a?.sort_order - b?.sort_order,
            },
        },
        {
            title: t('catalog.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: () => {
                return (
                    <>
                        <Space>
                            <EditProductModal />
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('catalog.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                content={t('catalog.confirm_delete')}
                                title={t('catalog.confirm_delete_title')}
                            />
                        </Space>
                    </>
                );
            },
        },
        // Table.SELECTION_COLUMN,
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
                    <title>{t("catalog.meta_title") + ' / V-OSINT3 Plus'}</title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={catalogBreadcrumbs}
                title={t('catalog.title')}
                children={
                    <Space align="center">
                        <CreateProductModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('catalog.refresh')}>
                                <Button shape="circle">
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('catalog.delete_multi')}>
                                        <Button shape="circle">
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip>
                                }
                                content={t('catalog.confirm_delete_multi')}
                                title={t('catalog.confirm_delete_title')}
                            />
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('catalog.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    columns={DATA_CATALOG_COLUMNS}
                    data={DATA_CATALOGS}
                    total={50}
                    isCheckBox
                />
            </div>
        </>
    );
};

export default DataCatalog;
