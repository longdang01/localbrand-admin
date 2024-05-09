import { useEffect } from 'react';
import {
    Flex,
    Layout,
    Typography,
    theme,
} from 'antd';
import classes from './sidebar.module.scss';
import Sider from 'antd/es/layout/Sider';
import { useColorState } from '@/stores/color.store';
import { useSidebar } from '@/stores/sidebar.store';
import MenuFunctions from './components/menu-functions/MenuFunctions';
import MenuUsers from './components/menu-users/MenuUsers';
import LogoLight from '../logo/LogoLight';
import LogoDark from '../logo/LogoDark';

const { useToken } = theme;

const Sidebar = () => {
    // const { t } = useTranslation('translation');
    const { token } = useToken();
    const [,] = useColorState((state) => [state.themeColor]);
    const [collapsed, setCollapsed] = useSidebar((state) => [
        state.collapsed,
        state.setCollapsed,
    ]);

    useEffect(() => {
        const handleResize = () => {
            const isSmallScreen =
                window.matchMedia('(max-width: 768px)').matches;

            setCollapsed(isSmallScreen);
        };

        window.addEventListener('resize', handleResize);

        // Initial check on component mount
        handleResize();

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <Sider
                width={255}
                className={classes.sider}
                collapsed={collapsed}
                collapsedWidth={70}
            >
                <Layout
                    className={classes.container}
                    style={{
                        borderRight: `1px solid ${token.colorBorder}`,
                        background: token.colorPrimaryText,
                    }}
                >
                    <Flex
                        vertical={true}
                        justify={'space-between'}
                        className={classes.inner}
                    >
                        <Flex vertical style={{ height: '100%' }}>
                            <Typography.Link
                                className={`${classes.brand} ${collapsed ? classes.collapsed : ''}`}
                            >
                                {token.colorPrimary == '#1677ff' ? (
                                    // <BrandLight />
                                    <LogoLight />
                                ) : (
                                    // <BrandDark />
                                    <LogoDark />
                                )}
                            </Typography.Link>
                            <MenuFunctions />
                        </Flex>
                        <MenuUsers />
                    </Flex>
                </Layout>
            </Sider>
        </>
    );
};

export default Sidebar;
