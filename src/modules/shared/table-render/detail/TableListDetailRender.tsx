import { Button, Flex, Space, Typography } from 'antd';
import classes from './table-list-detail-render.module.scss';
import { StarOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
    record?: any;

    expandCollapsedOption?: React.ReactNode;
    backOption?: React.ReactNode;
}
const TableListDetailRender = ({ record, expandCollapsedOption, backOption }: Props) => {
    return (
        <>
            <div className={classes.boxContainer}>
                <div style={{ cursor: "pointer" }} className={classes.boxClose}>
                    {expandCollapsedOption || backOption }  
                </div>
                <div className={classes.boxInner}>
                    <Typography.Text
                        className={`text-bold ${classes.boxTitle}`}
                    >
                        {record?.address}
                    </Typography.Text>
                    <Typography.Text
                        className={`text-secondary ${classes.boxDate}`}
                    >
                        {record?.date}
                    </Typography.Text>
                    <Flex
                        align="center"
                        justify="space-between"
                        className={classes.boxTool}
                    >
                        <Space>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                        </Space>
                        <Space>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                            <Button
                                shape="circle"
                                icon={<StarOutlined />}
                            ></Button>
                        </Space>
                    </Flex>
                    <div className={classes.boxContent}>Do something</div>
                </div>
            </div>
        </>
    );
};

export default TableListDetailRender;
