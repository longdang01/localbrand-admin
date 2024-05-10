import { Avatar, Flex, Typography } from 'antd';
import classes from './logo.module.scss';
import { useSidebar } from '@/stores/sidebar.store';
import logo6 from "@/assets/images/logo/logo6.png";
import { useTranslation } from 'react-i18next';

const LogoLight = () => {
    const { t } = useTranslation("translation");

    const [collapsed,] = useSidebar((state) => [state.collapsed,]);
    return <>
        <Flex align="center">
            <Avatar shape="square" src={logo6} className={classes.logoImage} />
            {!collapsed && (
                <Typography.Text
                    className={classes.logoTitle}
                    style={{ color: '#ffffff' }}
                    ellipsis
                >
                    {t("app.title")}
                </Typography.Text>
            )}
        </Flex>
    </>;
};

export default LogoLight;
