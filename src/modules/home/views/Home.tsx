import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Button, Flex, Input, Space, TableColumnsType, Tooltip } from 'antd';
import { homeBreadcrumbs } from '../constants/home-breadcrumb.constants';
import { HOME_DATA } from '../constants/home-table.constants';
import TableRender from '@/modules/shared/table-render/TableRender';
import { DataType } from '@/models/table';
import { PAGE_INDEX, PAGE_SIZE } from '@/constants/config';
import { DeleteOutlined } from '@ant-design/icons';
import EditModalRender from '../components/EditModalRender';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';

const { Search } = Input;

const Home = () => {
    const HOME_COLUMNS: TableColumnsType<DataType> = [
        {
            title: 'Serial',
            align: 'center',
            width: 80,
            render: (_, __, index) =>
                (Number(PAGE_INDEX) - 1) * Number(PAGE_SIZE) + index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text: string) => <a>{text}</a>,
            sorter: {
                compare: (a: any, b: any) => a?.name - b?.name,
            },
        },
        {
            title: 'Age',
            dataIndex: 'age',
            sorter: {
                compare: (a: any, b: any) => a?.age - b?.age,
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: {
                compare: (a: any, b: any) => a?.address - b?.address,
            },
        },
        {
            title: 'Action',
            width: 150,
            align: 'right',
            fixed: 'right',
            render: () => {
                return (
                    <>
                        <Space>
                            <EditModalRender />
                            <ConfirmRender buttonRender={
                                <Tooltip title="Delete">
                                    <Button
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        className="btn-delete"
                                    />
                                </Tooltip>
                            } />
                        </Space>
                    </>
                );
            },
        },
        // Table.SELECTION_COLUMN,
    ];

    const handleSearch = (_: string) => {};

    return (
        <>
            <PageHeader
                pageBreadcrumbs={homeBreadcrumbs}
                title={'Drafts'}
                children={
                    <Space align="center">
                        <Button>New template</Button>
                        <Button type="primary">New project</Button>
                    </Space>
                }
                isContainTitle={true}
            />

            <div className="layout">
                <Flex align="center" justify="end">
                    <Search
                        style={{ width: 400 }}
                        placeholder="Search here..."
                        onSearch={(e) => handleSearch(e)}
                        enterButton
                    />
                </Flex>
                <TableRender
                    columns={HOME_COLUMNS}
                    data={HOME_DATA}
                    total={50}
                    isCheckBox={true}
                />
            </div>
        </>
    );
};

export default Home;
