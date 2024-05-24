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
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import {
    DeleteOutlined,
    EditOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
    FORMAT_DATE,
    ORDERS_STATUSES,
    PAGE_INDEX,
    PAGE_SIZE,
    SEARCH_DATA,
} from '@/constants/config';
import {
    CACHE_ORDER,
    useRemoveOrder,
    useSearchOrders,
} from '@/loaders/order.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { OrderProps } from '@/models/order';
import dayjs from 'dayjs';
import { getUrl } from '@/utils/navigate';
import { ORDER_EDIT_PATH } from '@/paths';

const { Search } = Input;

const OrderTable = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'sell',
    });
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || '1';
    const pageSize = searchParams.get(PAGE_SIZE) || '10';
    const searchData = searchParams.get(SEARCH_DATA) || '';

    const searchOrders = useSearchOrders({
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteOrder = useRemoveOrder({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_ORDER.SEARCH]);

                notification.success({
                    message: t('order.delete_success'),
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
        searchOrders.refetch();
    };

    const handleEdit = (order: OrderProps) => {
        navigate(getUrl(ORDER_EDIT_PATH, order?.ordersCode, ':ordersCode'));
    };

    const handleDelete = (id: string) => {
        deleteOrder.mutate(id);
    };

    const ORDER_COLUMNS: TableColumnsType<OrderProps> = [
        {
            title: t('order.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('order.fields.order_code'),
            dataIndex: 'ordersCode',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.ordersCode - b?.ordersCode,
            },
        },
        {
            title: t('order.fields.created_at'),
            dataIndex: 'createdAt',
            render: (text: string) => (
                <Typography.Text>
                    {dayjs(text).format(FORMAT_DATE)}
                </Typography.Text>
            ),
            sorter: {
                compare: (a: any, b: any) => a?.createdAt - b?.createdAt,
            },
        },
        {
            title: t('order.fields.status'),
            dataIndex: 'status',
            render: (status: number) => (
                <Typography.Text>
                    {ORDERS_STATUSES.map(
                        (s, index) =>
                            s.value == String(status) && (
                                <div
                                    key={index}
                                    style={{
                                        color: s.color,
                                    }}
                                >
                                    ({s.label})
                                </div>
                            ),
                    )}
                </Typography.Text>
            ),
        },
        {
            title: t('order.fields.paid_status'),
            dataIndex: 'paid',
            render: (paid: number) => (
                <Typography.Text>
                    {paid == 1 ? (
                        <Typography.Text className="text-success">
                            {`(${t('order.paid')})`}
                        </Typography.Text>
                    ) : (
                        <Typography.Text className="text-danger">
                            {`(${t('order.unpaid')})`}
                        </Typography.Text>
                    )}
                </Typography.Text>
            ),
        },
        {
            title: t('order.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <Tooltip title={t('order.update')}>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    className="btn-edit"
                                    onClick={() => handleEdit(record)}
                                />
                            </Tooltip>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('order.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('order.confirm_delete')}
                                title={t('order.confirm_delete_title')}
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
                        searchOrders?.isLoading || searchOrders?.isFetching
                    }
                    columns={ORDER_COLUMNS}
                    data={searchOrders?.data?.orders}
                    total={searchOrders?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default OrderTable;
