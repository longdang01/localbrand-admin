import { BrandDark, BrandLight } from '@/assets/svg/index';
import { Button, Drawer, Flex, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import classes from './header.module.scss';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import MenuFunctions from '../sidebar/components/menu-functions/MenuFunctions';
import MenuUsers from '../sidebar/components/menu-users/MenuUsers';

const { useToken } = theme;

const HeaderRender = () => {
    const { token } = useToken();
    const [open, setOpen] = useState<boolean>(false);

    const handleShowDrawer = () => {
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <>
            <Header className={classes.header}>
                <Flex
                    align="center"
                    justify="space-between"
                    className={classes.container}
                >
                    {token.colorPrimary == '#1677ff' ? (
                        <BrandLight />
                    ) : (
                        <BrandDark />
                    )}
                    <Button icon={<FaBars />} onClick={handleShowDrawer} />
                </Flex>
            </Header>
            <Drawer
                title="Menu"
                open={open}
                onClose={handleCloseDrawer}
                className={classes.mobileContainer}
            >
                <MenuFunctions />
                <MenuUsers vertical={false}/>
            </Drawer>
        </>
    );
};

export default HeaderRender;
