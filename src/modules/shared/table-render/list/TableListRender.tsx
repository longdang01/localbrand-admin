import { DataType } from '@/models/table';
import { Button, Space, Table, TableColumnsType, Typography } from 'antd';
import classes from './table-list-render.module.scss';
import { CloseOutlined, StarOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import TableListDetailRender from '../detail/TableListDetailRender';

interface Props {
    data?: any;
    columns?: any;
    expandedRow?: any;
}

const TYPE_SELECT = 'checkbox';

const TableListRender = ({ data, columns, expandedRow }: Props) => {
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    const isMediumScreen = useMediaQuery({ maxWidth: 1400 });

    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);

    const handleExpand = (record: any) => {
        const { key } = record;
        const isExpanded = expandedRowKeys.includes(key);

        if (isExpanded) {
            // Collapse the row
            setExpandedRowKeys(expandedRowKeys.filter((k: any) => k !== key));
        } else {
            // Expand the row
            setExpandedRowKeys([...expandedRowKeys, key]);
        }
    };

    const defaultColumns: TableColumnsType<DataType> = [
        {
            width: 120,
            render: () => {
                return (
                    <>
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
                    </>
                );
            },
        },
        {
            // title: 'Name',
            width: 100,
            dataIndex: 'name',
            align: 'start',
            render: (name) => {
                return (
                    <Typography.Text className="text-secondary" ellipsis>
                        {name}
                    </Typography.Text>
                );
            },
        },
        {
            // title: 'Age',
            dataIndex: 'address',
            render: (address, record) => {
                return (
                    <>
                        <Typography.Text
                            ellipsis
                            style={{
                                cursor: 'pointer',
                                maxWidth: isSmallScreen
                                    ? 250
                                    : isMediumScreen
                                      ? 350
                                      : 700,
                            }}
                            onClick={() => handleExpand(record)}
                        >
                            <span className="text-bold">{address}</span>
                            <span> - </span>
                            <span className="text-secondary">
                                {record?.content}
                            </span>
                        </Typography.Text>
                    </>
                );
            },
        },
        {
            // title: 'Address',
            width: 200,
            align: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Typography.Text className="table-date">
                            {record?.date}
                        </Typography.Text>
                        <Space className={'table-tools'}>
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
                    </>
                );
            },
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
            );
        },
    };

    const expandedRender = (record: any) => {
        return (
            <>
                <TableListDetailRender
                    record={record}
                    expandCollapsedOption={
                        <Button
                            icon={<CloseOutlined />}
                            shape="circle"
                            onClick={() => handleExpand?.(record)}
                        />
                    }
                />
            </>
        );
    };

    return (
        <>
            <div className={classes.tableContainer}>
                <Table
                    rowSelection={{
                        type: TYPE_SELECT,
                        ...rowSelection,
                        // fixed: "left",
                        // columnWidth: 50
                    }}
                    expandable={{
                        showExpandColumn: false,
                        expandedRowRender: (record) => expandedRender(record),
                        rowExpandable: (record) =>
                            record.name !== 'Not Expandable',
                        expandedRowKeys: expandedRow || expandedRowKeys,
                    }}
                    scroll={{ x: 768 }}
                    columns={columns || defaultColumns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                    rowKey={'key'}
                />
            </div>
        </>
    );
};

export default TableListRender;
