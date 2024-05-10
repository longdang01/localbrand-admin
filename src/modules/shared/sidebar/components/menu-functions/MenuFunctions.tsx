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
import { useNavigate } from 'react-router-dom';
import { BRAND_PATH, CATEGORY_BIG_PATH, CATEGORY_SMALL_PATH, COLLECTION_PATH, DASHBOARD_PATH, IMPORT_BILL_PATH, PRODUCT_PATH, SUPPLIER_PATH } from '@/paths';
import { FiActivity } from "react-icons/fi";
const { useToken } = theme;

const MenuFunctions = () => {
    const { t } = useTranslation('translation');
    const { token } = useToken();
    const navigate = useNavigate();

    const [collapsed,] = useSidebar((state) => [state.collapsed,])
    const [stateOpenKeys, setStateOpenKeys] = useState(["1"])

    useEffect(() => {
        if(!collapsed) {
            setTimeout(() => {
                setStateOpenKeys(["1"])
            }, 300);
        }
    }, [collapsed])

    const handleNavigate = (e: any) => {
        switch(e?.key) {
            case "1":
                navigate(DASHBOARD_PATH);
                break;
            case "21":
                navigate(PRODUCT_PATH);
                break;
            case "22":
                navigate(IMPORT_BILL_PATH);
                break;
            case "23":
                navigate(CATEGORY_BIG_PATH);
                break;
            case "24":
                navigate(CATEGORY_SMALL_PATH);
                break;
            case "25":
                navigate(BRAND_PATH);
                break;
            case "26":
                navigate(SUPPLIER_PATH);
                break;
            case "27":
                navigate(COLLECTION_PATH);
                break;
        }
        
    }

    // DEFINED MENU
    const MENU: NavigationItem[] = [
        {
            key: 1,
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
                    key: 21,
                    label: t('import.features.product'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 22,
                    label: t('import.features.import_bill'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 23,
                    label: t('import.features.category_big'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 24,
                    label: t('import.features.category_small'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 25,
                    label: t('import.features.brand'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 26,
                    label: t('import.features.supplier'),
                    icon: <FiActivity />,
                    children: [],
                },
                {
                    key: 27,
                    label: t('import.features.collection'),
                    icon: <FiActivity />,
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
                        defaultSelectedKeys={['11']}
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
