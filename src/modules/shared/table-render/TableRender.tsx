import { Flex, Table, TableColumnsType } from 'antd';
import classes from './table-render.module.scss';
import PaginationRender from '../pagination-render/PaginationRender';
import { useMediaQuery } from 'react-responsive';

interface Props {
    columns?: TableColumnsType<any>;
    data?: any[];
    total?: number;
    isCheckBox?: boolean;
    rowKey?: string;
    loading?: boolean;
}

const TYPE_SELECT = 'checkbox';

const TableRender = ({ columns, data, total, isCheckBox = false, rowKey = "_id", loading }: Props) => {
    const hideGotoRange1 = useMediaQuery({ minWidth: 600, maxWidth: 650 });
    const hideGotoRange2 = useMediaQuery({ minWidth: 750, maxWidth: 850 });

    // rowSelection object indicates the need for row selection
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
            <div className={classes.tableContainer}>
                <Table
                    loading={loading}
                    rowSelection={
                        isCheckBox
                            ? {
                                  type: TYPE_SELECT,
                                  ...rowSelection,
                              }
                            : undefined
                    }
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 768, y: 300 }}
                    pagination={false}
                    bordered
                    size="large"
                    rowKey={rowKey}
                />
            </div>
            <Flex align="center" justify="end">
                <PaginationRender
                    total={total}
                    showQuickJumper={(hideGotoRange1 || hideGotoRange2) ? false : true}
                />
            </Flex>
        </>
    );
};

export default TableRender;
