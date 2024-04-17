import { Layout, Menu, MenuProps, theme } from 'antd';
import classes from '../../sidebar.module.scss';
import { useState } from 'react';
import { items, levelKeys } from '../../constants/sidebar.constants';

const { useToken } = theme;

const MenuFunctions = () => {
    const { token } = useToken();
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1,
        );
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) => levelKeys[key] === levelKeys[currentOpenKey],
                );

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter(
                        (key) => levelKeys[key] <= levelKeys[currentOpenKey],
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
                        defaultSelectedKeys={['231']}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        items={items}
                    />
                </Layout>
            </div>
        </>
    );
};

export default MenuFunctions;
