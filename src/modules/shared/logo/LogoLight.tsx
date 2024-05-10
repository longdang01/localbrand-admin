import { Avatar, Flex, Typography } from 'antd';
import classes from './logo.module.scss';
import { useSidebar } from '@/stores/sidebar.store';
import logo6 from "@/assets/images/logo/logo6.png";
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

const LogoLight = () => {
    const { t } = useTranslation("translation");

    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    const [collapsed,] = useSidebar((state) => [state.collapsed,]);
    return <>
        <Flex align="center">
            <Avatar shape="square" src={logo6} className={classes.logoImage} />
            {(!collapsed && !isSmallScreen) && (
                <Typography.Text
                    className={classes.logoTitle}
                    style={{ color: '#141414' }}
                    ellipsis
                >
                    {t("app.title")}
                </Typography.Text>
            )}
        </Flex>
    </>;
};

export default LogoLight;
