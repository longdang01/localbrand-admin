import { PAGE_INDEX, PAGE_SIZE, SEARCH_DATA } from '@/constants/config';
import { useSearchProducts } from '@/loaders/product.loader';
import { ProductProps } from '@/models/product';
import TableRender from '@/modules/shared/table-render/TableRender';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Space, TableColumnsType, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { TiArrowBackOutline } from 'react-icons/ti';
import { useSearchParams } from 'react-router-dom';
import CreateProductModal from './CreateProductModal';
const { Search } = Input;

const ProductTable = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'sell' });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || '1';
    const pageSize = searchParams.get(PAGE_SIZE) || '10';
    const searchData = searchParams.get(SEARCH_DATA) || '';

    const searchProducts = useSearchProducts({
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const PRODUCT_COLUMNS: TableColumnsType<ProductProps> = [
        {
            title: t('product.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('product.fields.product_name'),
            dataIndex: 'productName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.productName - b?.productName,
            },
        },
        {
            title: t('product.fields.path'),
            dataIndex: 'path',
        },
        {
            title: t('product.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <CreateProductModal id={record?._id} />
                        </Space>
                    </>
                );
            },
        },
    ];

    const handleSearch = (searchData: string) => {
        if (searchData) searchParams.set(SEARCH_DATA, searchData);
        else searchParams.delete(SEARCH_DATA);

        setSearchParams(searchParams);
    };

    const handleRefresh = () => {
        searchProducts.refetch();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('order.back')}>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<TiArrowBackOutline />}
                                    onClick={() => handleBack()}
                                />
                            </Tooltip>

                            <Tooltip title={t('order.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('order.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={
                        searchProducts?.isLoading || searchProducts?.isFetching
                    }
                    columns={PRODUCT_COLUMNS}
                    data={searchProducts?.data?.products}
                    total={searchProducts?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default ProductTable;
