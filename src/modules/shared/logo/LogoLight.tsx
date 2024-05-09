import { Avatar, Flex, Typography } from 'antd';
import classes from './logo.module.scss';
import { useSidebar } from '@/stores/sidebar.store';
import logo3 from "@/assets/images/logo/logo3.png";
import { useMediaQuery } from 'react-responsive';

const LogoLight = () => {
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    const [collapsed,] = useSidebar((state) => [state.collapsed,]);
    return <>
        <Flex align="center">
            <Avatar shape="square" src={logo3} className={classes.logoImage} />
            {(!collapsed && !isSmallScreen) && (
                <Typography.Text
                    className={classes.logoTitle}
                    style={{ color: '#141414' }}
                    ellipsis
                >
                    V-OSINT3 Plus
                </Typography.Text>
            )}
        </Flex>
    </>;
};

export default LogoLight;
