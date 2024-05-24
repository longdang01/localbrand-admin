import { Layout, Menu, MenuProps, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FolderOpenOutlined,
    HomeOutlined,
    MoneyCollectOutlined,
    ProductOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import {
    convertToMenuItems,
    getItem,
    getLevelKeys,
} from '../../utils/generate-menu';
import { LevelKeysProps, MenuItem, NavigationItem } from '@/models/sidebar';
import { useSidebar } from '@/stores/sidebar.store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    BRAND_PATH,
    CATEGORY_BIG_PATH,
    CATEGORY_SMALL_PATH,
    COLLECTION_PATH,
    CUSTOMER_PATH,
    DASHBOARD_PATH,
    STAFF_PATH,
    IMPORT_BILL_PATH,
    LOOKBOOK_PATH,
    ORDER_PATH,
    PRODUCT_PATH,
    SLIDE_PATH,
    SUPPLIER_PATH,
} from '@/paths';
import { GoDot } from 'react-icons/go';
import { removeNumbersFromString } from '@/utils/format-string';
import { useGetMe } from '@/loaders/auth.loader';

const { useToken } = theme;

const MenuFunctions = () => {
    const { t } = useTranslation('translation');
    const { token } = useToken();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const currentUser = useGetMe({});

    const [collapsed] = useSidebar((state) => [state.collapsed]);
    const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(['1']);

    useEffect(() => {
        if (!collapsed) {
            setTimeout(() => {
                const openKeys = getOpenKeysFromPathname(pathname, MENU);
                setStateOpenKeys(openKeys as string[]);
            }, 300);
        }
    }, [collapsed, pathname]);

    const handleNavigate = (e: any) => {
        navigate(e?.key);
    };

    const getOpenKeysFromPathname = (
        pathname: string,
        menu: NavigationItem[],
    ): (string | number)[] => {
        const openKeys: (string | number)[] = [];

        const findOpenKeys = (
            items: NavigationItem[],
            parentKey: string | number | null = null,
        ): void => {
            items.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    if (
                        item.children.some(
                            (child) =>
                                child.key === pathname ||
                                pathname?.includes(String(child?.key)),
                        )
                    ) {
                        openKeys.push(String(item.key));
                        if (parentKey) {
                            openKeys.push(String(parentKey));
                        }
                    }
                    findOpenKeys(item.children, item.key);
                }
            });
        };

        findOpenKeys(menu);
        return openKeys;
    };

    // DEFINED MENU
    const MENU: NavigationItem[] = [
        {
            key: DASHBOARD_PATH,
            label: t('dashboard.title'),
            icon: <HomeOutlined />,
            children: [],
            roles: [1, 2, 3, 4],
        },
        {
            key: 2,
            label: t('import.title'),
            icon: <FolderOpenOutlined />,
            children: [
                {
                    key: PRODUCT_PATH,
                    label: t('import.features.product'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: IMPORT_BILL_PATH,
                    label: t('import.features.import_bill'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: CATEGORY_BIG_PATH,
                    label: t('import.features.category_big'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: CATEGORY_SMALL_PATH,
                    label: t('import.features.category_small'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: BRAND_PATH,
                    label: t('import.features.brand'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: SUPPLIER_PATH,
                    label: t('import.features.supplier'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: COLLECTION_PATH,
                    label: t('import.features.collection'),
                    icon: <GoDot />,
                    children: [],
                },
            ],
            roles: [1, 2],
        },
        {
            key: 3,
            label: t('sell.title'),
            icon: <MoneyCollectOutlined />,
            children: [
                {
                    key: ORDER_PATH,
                    label: t('sell.features.order'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: CUSTOMER_PATH,
                    label: t('sell.features.customer'),
                    icon: <GoDot />,
                    children: [],
                },
            ],
            roles: [1, 3],
        },
        {
            key: 4,
            label: t('system.title'),
            icon: <SettingOutlined />,
            children: [
                {
                    key: STAFF_PATH,
                    label: t('system.features.staff'),
                    icon: <GoDot />,
                    children: [],
                },
            ],
            roles: [1],
        },
        {
            key: 5,
            label: t('media.title'),
            icon: <ProductOutlined />,
            children: [
                {
                    key: SLIDE_PATH,
                    label: t('media.features.slide'),
                    icon: <GoDot />,
                    children: [],
                },
                {
                    key: LOOKBOOK_PATH,
                    label: t('media.features.lookbook'),
                    icon: <GoDot />,
                    children: [],
                },
            ],
            roles: [1, 4],
        },
    ];

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1,
        );
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) =>
                        getLevelKeys(
                            convertToMenuItems(
                                MENU?.filter((menu: NavigationItem) =>
                                    menu?.roles?.includes(
                                        Number(currentUser?.data?.user?.role),
                                    ),
                                ),
                                getItem,
                            ) as LevelKeysProps[],
                        )[key] ===
                        getLevelKeys(
                            convertToMenuItems(
                                MENU?.filter((menu: NavigationItem) =>
                                    menu?.roles?.includes(
                                        Number(currentUser?.data?.user?.role),
                                    ),
                                ),
                                getItem,
                            ) as LevelKeysProps[],
                        )[currentOpenKey],
                );

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter(
                        (key) =>
                            getLevelKeys(
                                convertToMenuItems(
                                    MENU?.filter((menu: NavigationItem) =>
                                        menu?.roles?.includes(
                                            Number(
                                                currentUser?.data?.user?.role,
                                            ),
                                        ),
                                    ),
                                    getItem,
                                ) as LevelKeysProps[],
                            )[key] <=
                            getLevelKeys(
                                convertToMenuItems(
                                    MENU?.filter((menu: NavigationItem) =>
                                        menu?.roles?.includes(
                                            Number(
                                                currentUser?.data?.user?.role,
                                            ),
                                        ),
                                    ),
                                    getItem,
                                ) as LevelKeysProps[],
                            )[currentOpenKey],
                    ),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    // Function to find the matching key
    const findMatchingKey = (items: MenuItem[], path: string): any => {
        for (let item of items) {
            if (removeNumbersFromString(path).includes(item.key)) {
                // if (item.key?.include(path)) {
                return item.key;
            }
            if (item.children) {
                const matchingChildKey = findMatchingKey(item.children, path);
                if (matchingChildKey) {
                    return matchingChildKey;
                }
            }
        }
        return null;
    };

    // Convert MENU to the format required by Ant Design Menu component
    const menuItems = useMemo(
        () =>
            convertToMenuItems(
                MENU?.filter((menu: NavigationItem) =>
                    menu?.roles?.includes(
                        Number(currentUser?.data?.user?.role),
                    ),
                ),
                getItem,
            ),
        [
            MENU?.filter((menu: NavigationItem) =>
                menu?.roles?.includes(Number(currentUser?.data?.user?.role)),
            ),
        ],
    );

    // Find the key that matches the current pathname
    const selectedKey = useMemo(
        () => findMatchingKey(menuItems, pathname),
        [menuItems, pathname],
    );

    return (
        <>
            <div className={classes.menu}>
                <Layout
                    className={classes.menuLayout}
                    style={{
                        background: token.colorPrimaryText,
                    }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        onClick={handleNavigate}
                        items={convertToMenuItems(
                            MENU?.filter((menu: NavigationItem) =>
                                menu?.roles?.includes(
                                    Number(currentUser?.data?.user?.role),
                                ),
                            ),
                            getItem,
                        )}
                    />
                </Layout>
            </div>
        </>
    );
};

export default MenuFunctions;
