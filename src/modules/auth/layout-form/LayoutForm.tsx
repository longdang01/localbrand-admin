import { Flex } from 'antd';
import classes from './layout-form.module.scss';
import React from 'react';
import logo from '@/assets/images/logo/logo.jpeg';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

interface Props {
    logoRender?: boolean;
    children?: React.ReactNode;
}

const TITLE_LOGIN = 'V-OSINT3 Plus';

const LayoutForm = ({ logoRender = false, children }: Props) => {
    const { t } = useTranslation('translation');
    const isResponsiveScreen = useMediaQuery({ maxWidth: 1200 });

    return (
        <>
            <div className={classes.container}>
                <Flex
                    align="center"
                    justify="center"
                    vertical
                    style={{ height: '100vh' }}
                >
                    {isResponsiveScreen && (
                        <Flex
                            className={classes.logoMobile}
                            vertical
                            align="center"
                        >
                            <div>{t('app.title')}</div>
                        </Flex>
                    )}

                    <div className={classes.inner}>
                        {logoRender && (
                            <div className={classes.logoTitle}>
                                {logo ? (
                                    <img
                                        src={logo}
                                        className={classes.logoImage}
                                    />
                                ) : (
                                    TITLE_LOGIN
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </Flex>
                {/* 
                <Flex className={classes.license} vertical align='center'>
                    <div>{t("app.license.vi")}</div>
                    <div>{t("app.license.en")}</div>
                </Flex> */}
            </div>
        </>
    );
};

export default LayoutForm;
