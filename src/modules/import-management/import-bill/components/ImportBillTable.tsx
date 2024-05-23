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
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
    FORMAT_DATE,
    PAGE_INDEX,
    PAGE_SIZE,
    SEARCH_DATA,
} from '@/constants/config';
import {
    CACHE_INVOICE,
    useRemoveInvoice,
    useSearchInvoices,
} from '@/loaders/invoice.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { InvoiceProps } from '@/models/invoice';
import dayjs from 'dayjs';
import { getUrl } from '@/utils/navigate';
import { IMPORT_BILL_EDIT_PATH } from '@/paths';

const { Search } = Input;

const ImportBillTable = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || '1';
    const pageSize = searchParams.get(PAGE_SIZE) || '10';
    const searchData = searchParams.get(SEARCH_DATA) || '';

    const searchInvoices = useSearchInvoices({
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteInvoice = useRemoveInvoice({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_INVOICE.SEARCH]);

                notification.success({
                    message: t('invoice.delete_success'),
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
        searchInvoices.refetch();
    };

    const handleEdit = (invoice: InvoiceProps) => {
        navigate(getUrl(IMPORT_BILL_EDIT_PATH, invoice?.invoiceCode, ":invoiceCode"))
    }

    const handleDelete = (id: string) => {
        deleteInvoice.mutate(id);
    };

    const INVOICE_COLUMNS: TableColumnsType<InvoiceProps> = [
        {
            title: t('invoice.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('invoice.fields.invoice_code'),
            dataIndex: 'invoiceCode',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.invoiceCode - b?.invoiceCode,
            },
        },
        {
            title: t('invoice.fields.created_at'),
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
            title: t('invoice.fields.status'),
            dataIndex: 'paid',
            render: (paid: number) => (
                <Typography.Text>
                    {paid == 1 ? (
                        <Typography.Text className="text-success">
                            {`(${t('invoice.paid')})`}
                        </Typography.Text>
                    ) : (
                        <Typography.Text className="text-danger">
                            {`(${t('invoice.unpaid')})`}
                        </Typography.Text>
                    )}
                </Typography.Text>
            ),
        },
        {
            title: t('invoice.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            {/* <EditBrandModal id={record?._id}/> */}
                            <Tooltip title={t('invoice.update')}>
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
                                    <Tooltip title={t('invoice.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('invoice.confirm_delete')}
                                title={t('invoice.confirm_delete_title')}
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
                            <Tooltip title={t('invoice.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('invoice.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={
                        searchInvoices?.isLoading || searchInvoices?.isFetching
                    }
                    columns={INVOICE_COLUMNS}
                    data={searchInvoices?.data?.invoices}
                    total={searchInvoices?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default ImportBillTable;
