import { Flex, Table, TableColumnsType } from 'antd';
import classes from './table-render.module.scss';
import PaginationRender from '../pagination-render/PaginationRender';
import { useMediaQuery } from 'react-responsive';

interface Props {
    columns?: TableColumnsType<any>;
    data?: any[];
    total?: number;
    isCheckBox?: boolean;

    // expanded
    columnsExpanded?: TableColumnsType<any>;
    isPaginationExpanded?: boolean;
}

const TYPE_SELECT = 'checkbox';

const NestedTableRender = ({
    columns,
    data,
    total,
    isCheckBox,
    columnsExpanded,
    isPaginationExpanded,
}: Props) => {
    const isLargeScreen = useMediaQuery({ minWidth: 1700 });
    const hideGotoRange1 = useMediaQuery({ minWidth: 600, maxWidth: 650 });
    const hideGotoRange2 = useMediaQuery({ minWidth: 750, maxWidth: 850 });

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                'selectedRows: ',
                selectedRows,
            );
        },
    };

    const expandedRowRender = (row: any) => {
        const rowSelection = {
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                console.log(
                    `selectedRowKeys: ${selectedRowKeys}`,
                    'selectedRows: ',
                    selectedRows,
                );
            },
        };

        return (
            <>
                <Table
                    rowSelection={{
                        type: TYPE_SELECT,
                        ...rowSelection,
                    }}
                    rowKey={'key'}
                    columns={columnsExpanded}
                    dataSource={row?.vehicles || []}
                    pagination={false}
                />
                {isPaginationExpanded && (
                    <Flex
                        align="center"
                        justify="end"
                        style={{ paddingTop: 16 }}
                    >
                        <PaginationRender
                            current={1}
                            total={total}
                            showQuickJumper={false}
                            showSizeChanger={false}
                        />
                    </Flex>
                )}
            </>
        );
    };

    return (
        <>
            <div className={classes.tableContainer}>
                <Table
                    rowSelection={
                        isCheckBox
                            ? {
                                  type: TYPE_SELECT,
                                  ...rowSelection,
                              }
                            : undefined
                    }
                    expandable={{
                        expandedRowRender,
                    }}
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 768, y: isLargeScreen ? 550 : 350 }}
                    pagination={false}
                    bordered
                    size="large"
                />
            </div>
            <Flex align="center" justify="end">
                <PaginationRender
                    current={1}
                    total={total}
                    showQuickJumper={(hideGotoRange1 || hideGotoRange2) ? false : true}
                />
            </Flex>
        </>
    );
};

export default NestedTableRender;
