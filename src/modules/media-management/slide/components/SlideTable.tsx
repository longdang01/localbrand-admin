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
import { CACHE_SLIDE, useRemoveSlide, useSearchSlides } from '@/loaders/slide.loader';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { useSearchParams } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { SlideProps } from '@/models/slide';
import EditSlideModal from './EditSlideModal';

const { useToken } = theme;
const { Search } = Input;

const SlideTable = () => {
    const { token } = useToken();
    const { t } = useTranslation('translation', {
        keyPrefix: 'media',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const pageIndex = searchParams.get(PAGE_INDEX) || "1";
    const pageSize = searchParams.get(PAGE_SIZE) || "10";
    const searchData = searchParams.get(SEARCH_DATA) || "";

    const searchSlides = useSearchSlides({
        params: {   
            pageIndex: pageIndex,
            pageSize: pageSize,
            searchData: searchData,
        },
    });

    const deleteSlide = useRemoveSlide({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_SLIDE.SEARCH]);

                notification.success({
                    message: t('slide.delete_success'),
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
        searchSlides.refetch();
    }

    const handleDelete = (id: string) => {
        deleteSlide.mutate(id);
    }

    const SLIDE_COLUMNS: TableColumnsType<SlideProps> = [
        {
            title: t('slide.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(pageIndex) - 1) * Number(pageSize) + index + 1,
        },
        {
            title: t('slide.fields.picture'),
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
            title: t('slide.fields.slide_name'),
            dataIndex: 'slideName',
            render: (text: string) => <Typography.Text>{text || `(${t("slide.not_slide_name")})`}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.slideName - b?.slideName,
            },
        },
        {
            title: t('slide.fields.redirect_link'),
            dataIndex: 'redirectLink',
            render: (text: string) => <Typography.Text>{text || `(${t("slide.not_redirect_link")})`}</Typography.Text>,
            sorter: {
                compare: (a: any, b: any) => a?.redirectLink - b?.redirectLink,
            },
        },
        {
            title: t('slide.fields.action'),
            width: 150,
            align: 'right',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <EditSlideModal id={record?._id}/>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('slide.delete')}>
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            className="btn-delete"
                                        />
                                    </Tooltip>
                                }
                                handleConfirm={() => handleDelete(record?._id)}
                                content={t('slide.confirm_delete')}
                                title={t('slide.confirm_delete_title')}
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
                            <Tooltip title={t('slide.refresh')}>
                                <Button shape="circle" onClick={handleRefresh}>
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </>
                }
                right={
                    <Search
                        placeholder={t('slide.search_here')}
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 350 }}
                    />
                }
            />

            <div className="layout-horizontal">
                <TableRender
                    loading={searchSlides?.isLoading || searchSlides?.isFetching}
                    columns={SLIDE_COLUMNS}
                    data={searchSlides?.data?.slides}
                    total={searchSlides?.data?.total}
                    // isCheckBox
                />
            </div>
        </>
    );
};

export default SlideTable;
