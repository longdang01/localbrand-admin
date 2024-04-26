import { Outlet } from "react-router-dom";
import classes from "../scss/auth-layout.module.scss";
import { Col, Row } from "antd";

const AuthLayout = () => {
    return <>
        <div className={classes.container}>
            <Row>
                <Col span={24} md={12} lg={12}>
                    <div className={classes.imageContainer}>
                        <img src={undefined} className={classes.image} />
                    </div>  
                </Col>
                <Col span={24} md={12} lg={12}>
                    <Outlet />
                </Col>
            </Row>
        </div>
    </>
}

export default AuthLayout;