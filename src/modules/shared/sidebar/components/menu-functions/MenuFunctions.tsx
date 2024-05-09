import { Layout, Menu, MenuProps, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpenOutlined } from '@ant-design/icons';
import {
    convertToMenuItems,
    getItem,
    getLevelKeys,
} from '../../utils/generate-menu';
import { LevelKeysProps, NavigationItem } from '@/models/sidebar';
import { useSidebar } from '@/stores/sidebar.store';
import { useNavigate } from 'react-router-dom';
import { DATA_CATALOG_PATH, DATA_STATISTICS_PATH, DATA_WAREHOUSE_PATH } from '@/paths';

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
            case "11":
                navigate(DATA_CATALOG_PATH);
                break;
            case "12":
                navigate(DATA_WAREHOUSE_PATH);
                break;
            case "13":
                navigate(DATA_STATISTICS_PATH);
                break;
        }
        
    }

    // DEFINED MENU
    const MENU: NavigationItem[] = [
        {
            key: 1,
            label: t('data_warehouse.title'),
            icon: <FolderOpenOutlined />,
            children: [
                {
                    key: 11,
                    label: t('data_warehouse.features.catalog'),
                    icon: null,
                    children: [],
                },
                {
                    key: 12,
                    label: t('data_warehouse.features.warehouse'),
                    icon: null,
                    children: [],
                },
                {
                    key: 13,
                    label: t('data_warehouse.features.statistics'),
                    icon: null,
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
