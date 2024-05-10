import { PAGE_INDEX, PAGE_SIZE } from "@/constants/config";
import { CategoryBigProps } from "@/models/category-big";
import ConfirmRender from "@/modules/shared/modal/confirm/ConfirmRender";
import PageHeader from "@/modules/shared/page-header/Pageheader";
import TableRender from "@/modules/shared/table-render/TableRender";
import Toolbars from "@/modules/shared/toolbars/Toolbars";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Input, Space, TableColumnsType, Tooltip, Typography } from "antd";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CATEGORY_BIG_DATA } from "./constants/category-big.constants";
import noImage from "@/assets/images/default/no-image.png";
import EditCategoryBigModal from "./components/EditCategoryBigModal";
import CreateCategoryBigModal from "./components/CreateCategoryBigModal";

const { Search } = Input;

const CategoryBig = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const handleSearch = () => {};

    const CATEGORY_BIG_BREADCRUMBS = [
        {
            title: <span>{t('title')}</span>,
        },
    ];

    const CATEGORY_BIG_COLUMNS: TableColumnsType<CategoryBigProps> = [
        {
            title: t('category_big.fields.serial'),
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(PAGE_INDEX) - 1) * Number(PAGE_SIZE) + index + 1,
        },
        {
            title: t("category_big.fields.picture"),
            dataIndex: "picture",
            render: (picture) => {
                return <Avatar shape="circle" src={picture || noImage} size={"small"}/>
            }
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
            render: () => {
                return (
                    <>
                        <Space>
                            <EditCategoryBigModal />
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
    return <>
        <HelmetProvider>
            <Helmet>
                <meta charSet="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#000000" />
                <title>{t("category_big.meta_title") + ' / FRAGILE Việt Nam'}</title>
            </Helmet>
        </HelmetProvider>

        <PageHeader
                pageBreadcrumbs={CATEGORY_BIG_BREADCRUMBS}
                title={t('category_big.title')}
                children={
                    <Space align="center">
                        <CreateCategoryBigModal />
                    </Space>
                }
                isContainTitle={true}
            />

            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('category_big.refresh')}>
                                <Button shape="circle">
                                    <ReloadOutlined />
                                </Button>
                            </Tooltip>
                            <ConfirmRender
                                buttonRender={
                                    <Tooltip title={t('category_big.delete_multi')}>
                                        <Button shape="circle">
                                            <DeleteOutlined />
                                        </Button>
                                    </Tooltip>
                                }
                                content={t('category_big.confirm_delete_multi')}
                                title={t('category_big.confirm_delete_title')}
                            />
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
                    columns={CATEGORY_BIG_COLUMNS}
                    data={CATEGORY_BIG_DATA}
                    total={50}
                    isCheckBox
                />
            </div>
    </>
}

export default CategoryBig;