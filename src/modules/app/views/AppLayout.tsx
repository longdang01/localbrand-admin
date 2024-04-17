import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import '@/assets/scss/index.scss';
import classes from '../scss/app-layout.module.scss';
import Header from '@/modules/shared/header/Header';
import Sidebar from '@/modules/shared/sidebar/Sidebar';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

const AppLayout = () => {
    const isSmallScreen = useMediaQuery({ maxWidth: 600 });
    return (
        <>
            <Layout className={classes.layout}>
                {isSmallScreen ? <Header /> : <Sidebar />}
                <Content id="content" className={classes.content}>
                    <motion.div
                        viewport={{ once: true }}
                        initial={{ x: -50, opacity: 0.5 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Outlet />
                    </motion.div>
                </Content>
            </Layout>
        </>
    );
};

export default AppLayout;
