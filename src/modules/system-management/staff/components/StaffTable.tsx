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
import { StaffProps } from '@/models/staff';
import {
    PAGE_INDEX,
    PAGE_SIZE,
    SEARCH_DATA,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import {
    CACHE_STAFF,
    useRemoveStaff,
    useSearchStaffs,
} from '@/loaders/staff.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import EditStaffModal from './EditStaffModal';

const { useToken } = theme;
const { Search } = Input;

const StaffTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'system',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || '1';
    const pageSize = searchParams.get(PAGE_SIZE) || '10';
    const searchData = searchParams.get(SEARCH_DATA) || '';

    const searchStaffs = useSearchStaffs({
        params: {
            page_index: pageIndex,
            page_size: pageSize,
            search_text: searchData,
        },
    });

    const deleteStaff = useRemoveStaff({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_STAFF.SEARCH]);

                notification.success({
                    message: t('staff.delete_success'),
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

        searchParams.set(PAGE_INDEX, "1")

        setSearchParams(searchParams);
    };

    const handleRefresh = () => {
        searchStaffs.refetch();
    };

    const handleDelete = (id: string) => {
        deleteStaff.mutate(id);
    };

    const STAFF_COLUMNS: TableColumnsType<StaffProps> = [
        {
            title: t('staff.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('staff.fields.picture'),
            dataIndex: 'picture',
            width: 80,
            align: 'center',
            render: (picture) => {
                return (
                    <Avatar
                        shape="circle"
                        src={
                            picture || noImage
                        }
                        size={'small'}
                        style={{ border: `1px solid ${token?.colorPrimary}` }}
                    />
                );
            },
        },
        {
            title: t('staff.fields.staff_name'),
            dataIndex: 'staffName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) =>
                    a?.staffName?.localeCompare(b?.staffName),
            },
        },
        {
            title: t('staff.fields.phone'),
            dataIndex: 'phone',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) =>
                    a?.phone?.localeCompare(b?.phone),
            },
        },
        {
            title: t('staff.fields.action'),
            width: 210,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditStaffModal id={record?._id} />
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('staff.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('staff.confirm_delete')}
                                title={t('staff.confirm_delete_title')}
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
                            <Tooltip title={t('staff.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('staff.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchStaffs?.isLoading || searchStaffs?.isFetching}
                    columns={STAFF_COLUMNS}
                    data={searchStaffs?.data?.staffs}
                    total={searchStaffs?.data?.total}

                    // isCheckBox
                />
            </div>
        </>
    );
};

export default StaffTable;
