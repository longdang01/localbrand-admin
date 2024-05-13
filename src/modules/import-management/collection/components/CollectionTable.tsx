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
import { CACHE_COLLECTION, useRemoveCollection, useSearchCollections } from '@/loaders/collection.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { CollectionProps } from '@/models/collection';
import EditCollectionModal from './EditCollectionModal';
import CollectionGallery from './CollectionGallery';

const { Search } = Input;

const CollectionTable = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchCollections = useSearchCollections({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteCollection = useRemoveCollection({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_COLLECTION.SEARCH]);

                notification.success({
                    message: t('collection.delete_success'),
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
        searchCollections.refetch();
    }

    const handleDelete = (id: string) => {
        deleteCollection.mutate(id);
    }

    const COLLECTION_COLUMNS: TableColumnsType<CollectionProps> = [
        {
            title: t('collection.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('collection.fields.collection_name'),
            dataIndex: 'collectionName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.collectionName - b?.collectionName,
            },
        },
        {
            title: t('collection.fields.path'),
            dataIndex: 'path',
        },
        {
            title: t('collection.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditCollectionModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('collection.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('collection.confirm_delete')}
                                title={t('collection.confirm_delete_title')}
                            />
                            <CollectionGallery id={record?._id}/>

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
                            <Tooltip title={t('collection.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                            {/* <ConfirmRender
                                buttonRender={
                                    <Tooltip
                                        title={t('collection.delete_multi')}
                                    >
                                        <Button shape="circle">
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip>
                                }
                                content={t('collection.confirm_delete_multi')}
                                title={t('collection.confirm_delete_title')}
                            /> */}
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('collection.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchCollections?.isLoading || searchCollections?.isFetching}
                    columns={COLLECTION_COLUMNS}
                    data={searchCollections?.data?.collections}
                    total={searchCollections?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default CollectionTable;
