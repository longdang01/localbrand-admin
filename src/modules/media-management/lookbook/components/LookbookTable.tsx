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
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PAGE_INDEX, PAGE_SIZE, SEARCH_DATA } from '@/constants/config';
import { CACHE_LOOKBOOK, useRemoveLookbook, useSearchLookbooks } from '@/loaders/lookbook.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { LookbookProps } from '@/models/lookbook';
import EditLookbookModal from './EditLookbookModal';
import LookbookGallery from './LookbookGallery';
import { CollectionProps } from '@/models/collection';

const { Search } = Input;

const LookbookTable = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'media',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchLookbooks = useSearchLookbooks({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteLookbook = useRemoveLookbook({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_LOOKBOOK.SEARCH]);

                notification.success({
                    message: t('lookbook.delete_success'),
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
        searchLookbooks.refetch();
    }

    const handleDelete = (id: string) => {
        deleteLookbook.mutate(id);
    }

    const LOOKBOOK_COLUMNS: TableColumnsType<LookbookProps> = [
        {
            title: t('lookbook.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('lookbook.fields.lookbook_name'),
            dataIndex: 'lookbookName',
            render: (text: string, record: LookbookProps) => {
                return <>
                <Flex vertical>
                    <Typography.Text>{text}</Typography.Text>
                    <Typography.Text style={{ color: "grey", fontSize: 12}}>
                        {
                            searchLookbooks?.data?.collections?.find(
                                (collection: CollectionProps) => collection?._id == record?.collectionInfo
                            )?.collectionName
                        }
                    </Typography.Text>
                </Flex>
                </>
            },
            sorter: {
                compare: (a: any, b: any) => a?.lookbookName - b?.lookbookName,
            },
        },
        {
            title: t('lookbook.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditLookbookModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('lookbook.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('lookbook.confirm_delete')}
                                title={t('lookbook.confirm_delete_title')}
                            />
                            <LookbookGallery id={record?._id}/>

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
                            <Tooltip title={t('lookbook.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('lookbook.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchLookbooks?.isLoading || searchLookbooks?.isFetching}
                    columns={LOOKBOOK_COLUMNS}
                    data={searchLookbooks?.data?.lookbooks}
                    total={searchLookbooks?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default LookbookTable;
