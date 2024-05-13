import TableRender from '@/modules/shared/table-render/TableRender';
import {
    Avatar,
    Button,
    Flex,
    Input,
    Space,
    TableColumnsType,
    Tooltip,
    Typography,
    notification,
    theme,
} from 'antd';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PAGE_INDEX, PAGE_SIZE, SEARCH_DATA } from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import { CACHE_SUPPLIER, useRemoveSupplier, useSearchSuppliers } from '@/loaders/supplier.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import EditSupplierModal from './EditSupplierModal';
import { SupplierProps } from '@/models/supplier';

const { useToken } = theme;
const { Search } = Input;

const SupplierTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchSuppliers = useSearchSuppliers({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteSupplier = useRemoveSupplier({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_SUPPLIER.SEARCH]);

                notification.success({
                    message: t('supplier.delete_success'),
                });
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            }
        }
    });

    const handleSearch = (searchData: string) => {
        
        if(searchData) searchParams.set(SEARCH_DATA, searchData);
        else searchParams.delete(SEARCH_DATA);
        
        setSearchParams(searchParams);
    }

    const handleRefresh = () => {
        searchSuppliers.refetch();
    }

    const handleDelete = (id: string) => {
        deleteSupplier.mutate(id);
    }

    const SUPPLIER_COLUMNS: TableColumnsType<SupplierProps> = [
        {
            title: t('supplier.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('supplier.fields.picture'),
            dataIndex: 'picture',
            width: 100,
            align: "center",
            render: (picture) => {
                return (
                    <Avatar
                        shape="circle"
                        src={picture || noImage}
                        size={'small'}
                        style={{ border: `1px solid ${token?.colorPrimary}` }}
                    />
                );
            },
        },
        {
            title: t('supplier.fields.supplier_name'),
            dataIndex: 'supplierName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.supplierName - b?.supplierName,
            },
        },
        {
            title: t('supplier.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditSupplierModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('supplier.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('supplier.confirm_delete')}
                                title={t('supplier.confirm_delete_title')}
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
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('supplier.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('supplier.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchSuppliers?.isLoading || searchSuppliers?.isFetching}
                    columns={SUPPLIER_COLUMNS}
                    data={searchSuppliers?.data?.suppliers}
                    total={searchSuppliers?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default SupplierTable;
