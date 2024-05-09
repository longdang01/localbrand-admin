import { Flex, theme } from 'antd';
import React from 'react';
import classes from './toolbars.module.scss';

interface Props {
    left?: React.ReactNode;
    right?: React.ReactNode;
}

const { useToken } = theme;

const Toolbars = ({ left, right }: Props) => {
    const { token } = useToken();

    return (
        <Flex
            className={`${classes.container} ${token.colorBgLayout != '#141414' ? classes.light : classes.dark}`}
            align="center"
            justify="space-between"
        >
            <div className={classes.buttons}>
                {left}
            </div>
            {right}
        </Flex>
    );
};

export default Toolbars;
