import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import '@/assets/scss/index.scss';
import classes from '../scss/app-layout.module.scss';
import Header from '@/modules/shared/header/Header';
import Sidebar from '@/modules/shared/sidebar/Sidebar';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import 'react-quill/dist/quill.snow.css';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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
