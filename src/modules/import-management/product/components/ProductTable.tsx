import TableRender from '@/modules/shared/table-render/TableRender';
import {
    Button,
    Flex,
    Input,
    Space,
    TableColumnsType,
    Tooltip,
    Typography,
    notification,
} from 'antd';
import EditProductModal from './EditProductModal';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PAGE_INDEX, PAGE_SIZE, SEARCH_DATA } from '@/constants/config';
import {
    CACHE_PRODUCT,
    useRemoveProduct,
    useSearchProducts,
} from '@/loaders/product.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { ProductProps } from '@/models/product';
import { MdInvertColors } from "react-icons/md";
import { PRODUCT_DETAIL_PATH } from '@/paths';
import { getUrl } from '@/utils/navigate';
const { Search } = Input;

const ProductTable = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || '1';
    const pageSize = searchParams.get(PAGE_SIZE) || '10';
    const searchData = searchParams.get(SEARCH_DATA) || '';
    const navigate = useNavigate();

    const searchProducts = useSearchProducts({
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteProduct = useRemoveProduct({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_PRODUCT.SEARCH]);

                notification.success({
                    message: t('product.delete_success'),
                });
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleSearch = (searchData: string) => {
        if (searchData) searchParams.set(SEARCH_DATA, searchData);
        else searchParams.delete(SEARCH_DATA);

        setSearchParams(searchParams);
    };

    const handleRefresh = () => {
        searchProducts.refetch();
    };

    const handleDelete = (id: string) => {
        deleteProduct.mutate(id);
    };

    const handleViewDetail = (path: string) => {
        navigate(getUrl(PRODUCT_DETAIL_PATH, path, ":path"))
    }

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
                            <EditProductModal id={record?._id} />
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('product.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('product.confirm_delete')}
                                title={t('product.confirm_delete_title')}
                            />
                            <Tooltip title={t('product.detail')}>
                                <Button
                                    shape="circle"
                                    icon={<MdInvertColors />}
                                    onClick={() => handleViewDetail(record?.path)}
                                    className="btn-detail"
                                />
                            </Tooltip>
                        </Space>
                    </>
                );
            },
        },
        // Table.SELECTION_COLUMN,
    ];

    return (
        <>
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('product.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('product.search_here')}
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
