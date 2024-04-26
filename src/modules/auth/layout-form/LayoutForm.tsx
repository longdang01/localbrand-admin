import { Flex } from 'antd';
import classes from './layout-form.module.scss';
import React from 'react';
import logo from '@/assets/images/logo/logo.jpeg';

interface Props {
    logoRender?: boolean;
    children?: React.ReactNode;
}

const TITLE_LOGIN = 'V-OSINT3 Plus';

const LayoutForm = ({ logoRender = false, children }: Props) => {
    return (
        <>
            <div className={classes.container}>
                <Flex
                    align="center"
                    justify="center"
                    vertical
                    style={{ height: '100vh' }}
                >
                    <div className={classes.inner}>
                        {logoRender && (
                            <div className={classes.logoTitle}>
                                {logo ? <img src={logo} className={classes.logoImage}/> : TITLE_LOGIN}
                            </div>
                        )}
                        {children}
                    </div>
                </Flex>
            </div>
        </>
    );
};

export default LayoutForm;
