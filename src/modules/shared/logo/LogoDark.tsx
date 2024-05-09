import { Avatar, Flex, Typography } from 'antd';
import classes from './logo.module.scss';
import { useSidebar } from '@/stores/sidebar.store';
import logo3 from "@/assets/images/logo/logo3.png";

const LogoLight = () => {
    const [collapsed,] = useSidebar((state) => [state.collapsed,]);
    return <>
        <Flex align="center">
            <Avatar shape="square" src={logo3} className={classes.logoImage} />
            {!collapsed && (
                <Typography.Text
                    className={classes.logoTitle}
                    style={{ color: '#ffffff' }}
                    ellipsis
                >
                    V-OSINT3 Plus
                </Typography.Text>
            )}
        </Flex>
    </>;
};

export default LogoLight;
