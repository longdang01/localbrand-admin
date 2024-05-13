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
import { CACHE_CATEGORY_SMALL, useRemoveCategorySmall, useSearchCategoriesSmall } from '@/loaders/category-small.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { CategorySmallProps } from '@/models/category-small';
import EditCategorySmallModal from './EditCategorySmallModal';
import { CategoryBigProps } from '@/models/category-big';

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

    const searchCategoriesSmall = useSearchCategoriesSmall({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteCategorySmall = useRemoveCategorySmall({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_CATEGORY_SMALL.SEARCH]);

                notification.success({
                    message: t('category_small.delete_success'),
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
        searchCategoriesSmall.refetch();
    }

    const handleDelete = (id: string) => {
        deleteCategorySmall.mutate(id);
    }

    const CATEGORY_SMALL_COLUMNS: TableColumnsType<CategorySmallProps> = [
        {
            title: t('category_small.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('category_small.fields.picture'),
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
            title: t('category_small.fields.category_small_name'),
            dataIndex: 'subCategoryName',
            render: (text: string, record) => <>
                <Flex vertical>
                    <Typography.Text>{text}</Typography.Text>
                    <Typography.Text style={{ color: "grey", fontSize: 12}}>
                        {
                            searchCategoriesSmall?.data?.categories?.find(
                                (category: CategoryBigProps) => category?._id == record?.category
                            )?.categoryName
                        }
                    </Typography.Text>
                </Flex>
            </>,
            sorter: {
                compare: (a: any, b: any) => a?.subCategoryName - b?.subCategoryName,
            },
        },
        {
            title: t('category_small.fields.path'),
            dataIndex: 'path',
        },
        {
            title: t('category_small.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditCategorySmallModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('category_small.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('category_small.confirm_delete')}
                                title={t('category_small.confirm_delete_title')}
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
                            <Tooltip title={t('category_small.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('category_small.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchCategoriesSmall?.isLoading || searchCategoriesSmall?.isFetching}
                    columns={CATEGORY_SMALL_COLUMNS}
                    data={searchCategoriesSmall?.data?.subCategories}
                    total={searchCategoriesSmall?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default CategoryBigTable;
