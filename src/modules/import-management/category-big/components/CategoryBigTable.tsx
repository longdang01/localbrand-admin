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
import EditCategoryBigModal from './EditCategoryBigModal';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CategoryBigProps } from '@/models/category-big';
import { PAGE_INDEX, PAGE_SIZE, SEARCH_DATA } from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import { CACHE_CATEGORY_BIG, useRemoveCategoryBig, useSearchCategoriesBig } from '@/loaders/category-big.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';

const { useToken } = theme;
const { Search } = Input;

const CategoryBigTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchCategoriesBig = useSearchCategoriesBig({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteCategoryBig = useRemoveCategoryBig({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_CATEGORY_BIG.SEARCH]);

                notification.success({
                    message: t('category_big.delete_success'),
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
        searchCategoriesBig.refetch();
    }

    const handleDelete = (id: string) => {
        deleteCategoryBig.mutate(id);
    }

    const CATEGORY_BIG_COLUMNS: TableColumnsType<CategoryBigProps> = [
        {
            title: t('category_big.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('category_big.fields.picture'),
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
            title: t('category_big.fields.category_big_name'),
            dataIndex: 'categoryName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.categoryName - b?.categoryName,
            },
        },
        {
            title: t('category_big.fields.path'),
            dataIndex: 'path',
        },
        {
            title: t('category_big.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditCategoryBigModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('category_big.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('category_big.confirm_delete')}
                                title={t('category_big.confirm_delete_title')}
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
                            <Tooltip title={t('category_big.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                            {/* <ConfirmRender
                                buttonRender={
                                    <Tooltip
                                        title={t('category_big.delete_multi')}
                                    >
                                        <Button shape="circle">
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip>
                                }
                                content={t('category_big.confirm_delete_multi')}
                                title={t('category_big.confirm_delete_title')}
                            /> */}
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('category_big.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchCategoriesBig?.isLoading || searchCategoriesBig?.isFetching}
                    columns={CATEGORY_BIG_COLUMNS}
                    data={searchCategoriesBig?.data?.categories}
                    total={searchCategoriesBig?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default CategoryBigTable;
