import { Outlet } from 'react-router-dom';
import classes from '../scss/auth-layout.module.scss';
import { Col, Flex, Row, Typography } from 'antd';
import login1 from '@/assets/images/login/login1.png';
import login2 from '@/assets/images/login/login2.png';
import login3 from '@/assets/images/login/login3.png';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AuthLayout = () => {
    const { t } = useTranslation("translation");

    return (
        <>
            <div className={classes.container}>
                <Row>
                    <Col span={24} md={12} lg={12}>
                        <div className={classes.displayContainer}>
                            <Typography.Title className={classes.brand}>{t("app.title")}</Typography.Title>
                            <Flex
                                className={classes.displayInner}
                                align="center"
                                justify="center"
                                vertical
                            >
                                <div className={classes.main}>
                                    <motion.div
                                       initial={{ y: 5 }} 
                                       animate={{ y: [5, -5, 5] }} 
                                        transition={{ ease: "linear", duration: 5, repeat: Infinity }}
                                    >
                                        <img
                                            src={login2}
                                            className={classes.left}
                                        />
                                    </motion.div>
                                    <img
                                        src={login1}
                                        className={classes.center}
                                    />
                                    <motion.div
                                        initial={{ y: -5 }} 
                                        animate={{ y: [-5, 5, -5] }} 
                                        transition={{ ease: "linear", duration: 5, repeat: Infinity }}
                                    >
                                        <img
                                            src={login3}
                                            className={classes.right}
                                        />
                                    </motion.div>
                                </div>
                            </Flex>
                        </div>
                    </Col>
                    <Col span={24} md={12} lg={12}>
                        <Outlet />
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AuthLayout;
