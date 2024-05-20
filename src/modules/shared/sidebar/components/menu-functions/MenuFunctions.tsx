import { Layout, Menu, MenuProps, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpenOutlined, HomeOutlined } from '@ant-design/icons';
import {
    convertToMenuItems,
    getItem,
    getLevelKeys,
} from '../../utils/generate-menu';
import { LevelKeysProps, NavigationItem } from '@/models/sidebar';
import { useSidebar } from '@/stores/sidebar.store';
import { useLocation, useNavigate } from 'react-router-dom';
import { BRAND_PATH, CATEGORY_BIG_PATH, CATEGORY_SMALL_PATH, COLLECTION_PATH, DASHBOARD_PATH, IMPORT_BILL_PATH, PRODUCT_PATH, SUPPLIER_PATH } from '@/paths';
import { GoDot } from "react-icons/go";

const { useToken } = theme;

const MenuFunctions = () => {
    const { t } = useTranslation('translation');
    const { token } = useToken();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    

    const [collapsed,] = useSidebar((state) => [state.collapsed,])
    const [stateOpenKeys, setStateOpenKeys] = useState(["1", "2"])

    useEffect(() => {
        if(!collapsed) {
            setTimeout(() => {
                setStateOpenKeys(["1", "2"])
            }, 300);
        }
    }, [collapsed])

    const handleNavigate = (e: any) => {
        switch(e?.key) {
            case DASHBOARD_PATH:
                navigate(DASHBOARD_PATH);
                break;
            case PRODUCT_PATH:
                navigate(PRODUCT_PATH);
                break;
            case IMPORT_BILL_PATH:
                navigate(IMPORT_BILL_PATH);
                break;
            case CATEGORY_BIG_PATH:
                navigate(CATEGORY_BIG_PATH);
                break;
            case CATEGORY_SMALL_PATH:
                navigate(CATEGORY_SMALL_PATH);
                break;
            case BRAND_PATH:
                navigate(BRAND_PATH);
                break;
            case SUPPLIER_PATH:
                navigate(SUPPLIER_PATH);
                break;
            case COLLECTION_PATH:
                navigate(COLLECTION_PATH);
                break;
        }
    }

    // DEFINED MENU
    const MENU: NavigationItem[] = [
        {
            key: DASHBOARD_PATH,
            label: t('dashboard.title'),
            icon: <HomeOutlined />,
            children: []
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
                                MENU,
                                getItem,
                            ) as LevelKeysProps[],
                        )[key] ===
                        getLevelKeys(
                            convertToMenuItems(
                                MENU,
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
                                    MENU,
                                    getItem,
                                ) as LevelKeysProps[],
                            )[key] <=
                            getLevelKeys(
                                convertToMenuItems(
                                    MENU,
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
                        selectedKeys={[pathname]}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        onClick={handleNavigate}
                        items={convertToMenuItems(MENU, getItem)}
                        
                    />
                </Layout>
            </div>
        </>
    );
};

export default MenuFunctions;
