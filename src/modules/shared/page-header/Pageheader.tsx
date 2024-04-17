import {
    Button,
    Dropdown,
    Flex,
    Layout,
    MenuProps,
    Space,
    Tooltip,
    Typography,
    theme,
} from 'antd';
import BreadcrumbRender from '../breadcrumb/Breadcrumb';
import {
    BreadcrumbItemType,
    BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';
import { ReactNode, useEffect } from 'react';
import classes from './page-header.module.scss';
import { COLORS } from './constants/colors.constant';
import storage from '@/utils/storage';
import { ColorProps } from '@/models/color';
import { useColorState } from '@/stores/color.store';
import { themeLightConfig } from '@/constants/theme';
import { HomeOutlined, MoreOutlined } from '@ant-design/icons';
import { useSidebar } from '@/stores/sidebar.store';
import { useMediaQuery } from 'react-responsive';
import { UsLang, VnLang } from '@/assets/svg/index';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from 'react-icons/io5';

interface Props {
    pageBreadcrumbs?:
        | Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
        | undefined;
    title?: string;
    children?: ReactNode;
    isContainTitle?: boolean;
}

const { useToken } = theme;

const PageHeader = ({
    pageBreadcrumbs,
    title,
    children,
    isContainTitle,
}: Props) => {
    const { token } = useToken();
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    const { i18n } = useTranslation('translation');
    const disabledCollapsed = useMediaQuery({ maxWidth: 768 });
    const [, setThemeColor] = useColorState((state) => [, state.setThemeColor]);
    const [collapsed, setCollapsed] = useSidebar((state) => [
        state.collapsed,
        state.setCollapsed,
    ]);

    const [, setLocale] = useSidebar((state) => [
        state.locale,
        state.setLocale,
    ]);

    useEffect(() => {
        // console.log(COLORS?.find(color => color?.id == storage.getStorage("color"))?.config);
        setThemeColor(
            COLORS?.find(
                (color) => color?.id == localStorage.getItem('V-OSINT3_color'),
            )?.config || themeLightConfig,
        );
    }, []);

    const handleChangeColor = (color: ColorProps) => {
        storage.setStorage('color', color?.id);
        setThemeColor(color?.config);
    };

    const itemLanguages: MenuProps['items'] = [
        {
            key: 'vi',
            icon: <VnLang />,
            label: <Typography.Text strong>Việt Nam</Typography.Text>,
            onClick: (e) => handleChangeLanguage(e),
        },
        {
            key: 'en',
            icon: <UsLang />,
            label: <Typography.Text strong>English</Typography.Text>,
            onClick: (e) => handleChangeLanguage(e),
        },
    ];

    const handleChangeLanguage = (language: any) => {
        if (language?.key) {
            i18n.changeLanguage(language?.key);
            localStorage.setItem('locale', language?.key);
            setLocale(language?.key);
        }
    };

    return (
        <>
            <Layout
                className={`${classes.headerContainer} ${isContainTitle ? classes.isContainTitle : ''}`}
                style={{
                    borderBottom: `1px solid ${token.colorBorder}`,
                }}
            >
                <Flex justify="space-between" align="center">
                    <Space>
                        {!disabledCollapsed && (
                            <>
                                <Button
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    <HomeOutlined />
                                </Button>
                                <span>/</span>
                            </>
                        )}
                        <BreadcrumbRender items={pageBreadcrumbs} />
                    </Space>

                    <Space>
                        <Dropdown
                            menu={{ items: itemLanguages }}
                            trigger={['click']}
                            overlayStyle={{ zIndex: 9999999 }}
                        >
                            <Typography.Link
                                onClick={(e) => e.preventDefault()}
                                className={classes.btnLang}
                            >
                                <IoLanguage />
                            </Typography.Link>
                        </Dropdown>
                        <span>/</span>
                        <div className={classes.colorContainer}>
                            <Flex align="center">
                                {COLORS?.map((color) => (
                                    <Tooltip title={color?.name}>
                                        <Typography.Link
                                            className={classes.color}
                                            style={{ background: color?.hex }}
                                            onClick={() =>
                                                handleChangeColor(color)
                                            }
                                        ></Typography.Link>
                                    </Tooltip>
                                ))}
                            </Flex>
                            {/* <Switch
                                className={classes.btnSwitch}
                                size="default"
                                checkedChildren={<MoonFilled />}
                                unCheckedChildren={<SunOutlined />}
                                defaultChecked
                            /> */}
                        </div>
                    </Space>
                </Flex>
                {isContainTitle && (
                    <Flex justify="space-between" align="center">
                        <Typography.Text className={classes.headerTitle}>
                            {title}
                        </Typography.Text>
                        <>
                            {isSmallScreen ? (
                                <Dropdown
                                    className={classes.dropdown}
                                    dropdownRender={() => 
                                        <div className={classes.dropdownContainer}>
                                            <>{children}</>
                                        </div>
                                    }
                                    arrow
                                    placement="bottomRight"
                                    trigger={["click"]}
                                >
                                    <MoreOutlined />
                                </Dropdown>
                            ) : (
                                <>{ children }</>
                            )}
                        </>
                    </Flex>
                )}
            </Layout>
        </>
    );
};

export default PageHeader;
