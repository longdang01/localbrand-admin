import { Col, Divider, Row } from 'antd';
import CardSales from './mini-card/CardSales';
import CardProduct from './mini-card/CardProduct';
import CardOrder from './mini-card/CardOrder';
import CardCustomer from './mini-card/CardCustomer';
import SpendingChart from './column-chart/SpendingChart';
import RevenueChart from './column-chart/RevenueChart';

const DashboardArea = () => {
    return (
        <>
            <div className="layout">
                <Row gutter={[24, 24]}>
                    <Col span={24} md={12} lg={6}>
                        <CardSales />
                    </Col>
                    <Col span={24} md={12} lg={6}>
                        <CardProduct />
                    </Col>
                    <Col span={24} md={12} lg={6}>
                        <CardOrder />
                    </Col>
                    <Col span={24} md={12} lg={6}>  
                        <CardCustomer />
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[24, 24]}>
                    <Col span={24} md={12} lg={12}>
                        <SpendingChart />
                    </Col>
                    <Col span={24} md={12} lg={12}>
                        <RevenueChart />
                    </Col>

                </Row>
            </div>
        </>
    );
};

export default DashboardArea;
