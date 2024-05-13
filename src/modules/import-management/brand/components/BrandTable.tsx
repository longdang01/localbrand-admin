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
import { CACHE_BRAND, useRemoveBrand, useSearchBrands } from '@/loaders/brand.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { BrandProps } from '@/models/brand';
import EditBrandModal from './EditBrandModal';

const { useToken } = theme;
const { Search } = Input;

const BrandTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchBrands = useSearchBrands({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteBrand = useRemoveBrand({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_BRAND.SEARCH]);

                notification.success({
                    message: t('brand.delete_success'),
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
        searchBrands.refetch();
    }

    const handleDelete = (id: string) => {
        deleteBrand.mutate(id);
    }

    const BRAND_COLUMNS: TableColumnsType<BrandProps> = [
        {
            title: t('brand.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('brand.fields.picture'),
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
            title: t('brand.fields.brand_name'),
            dataIndex: 'brandName',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.brandName - b?.brandName,
            },
        },
        {
            title: t('brand.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditBrandModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('brand.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('brand.confirm_delete')}
                                title={t('brand.confirm_delete_title')}
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
                            <Tooltip title={t('brand.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('brand.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchBrands?.isLoading || searchBrands?.isFetching}
                    columns={BRAND_COLUMNS}
                    data={searchBrands?.data?.brands}
                    total={searchBrands?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default BrandTable;
