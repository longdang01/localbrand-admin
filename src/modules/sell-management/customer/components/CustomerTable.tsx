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
import { CACHE_CUSTOMER, useRemoveCustomer, useSearchCustomers } from '@/loaders/customer.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { CustomerProps } from '@/models/customer';
import EditCustomerModal from './EditCustomerModal';

const { useToken } = theme;
const { Search } = Input;

const CustomerTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'sell',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchCustomers = useSearchCustomers({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteCustomer = useRemoveCustomer({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_CUSTOMER.SEARCH]);

                notification.success({
                    message: t('customer.delete_success'),
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
        searchCustomers.refetch();
    }

    const handleDelete = (id: string) => {
        deleteCustomer.mutate(id);
    }

    const CUSTOMER_COLUMNS: TableColumnsType<CustomerProps> = [
        {
            title: t('customer.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('customer.fields.picture'),
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
            title: t('customer.fields.customer_name'),
            dataIndex: 'customerName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.customerName - b?.customerName,
            },
        },
        {
            title: t('customer.fields.phone'),
            dataIndex: 'phone',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.phone - b?.phone,
            },
        },
        {
            title: t('customer.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditCustomerModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('customer.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('customer.confirm_delete')}
                                title={t('customer.confirm_delete_title')}
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
                            <Tooltip title={t('customer.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('customer.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchCustomers?.isLoading || searchCustomers?.isFetching}
                    columns={CUSTOMER_COLUMNS}
                    data={searchCustomers?.data?.customers}
                    total={searchCustomers?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default CustomerTable;
