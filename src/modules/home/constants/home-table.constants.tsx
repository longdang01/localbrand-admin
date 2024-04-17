import { DataType } from '@/models/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, TableColumnsType, Tooltip } from 'antd';


export const HOME_EXPANDED_COLUMN: TableColumnsType<DataType> = [
    {
        title: 'Vehicle name',
        dataIndex: 'vehicle_name',
    },
    {
        title: 'Action',
        width: 150,
        align: 'right',
        fixed: 'right',
        render: () => {
            return (
                <>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            className="btn-edit"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            className="btn-delete"
                        />
                    </Tooltip>
                </>
            );
        },
    },
];

export const HOME_DATA: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        vehicles: [
            {
                key: '11',
                vehicle_name: 'Mercedes-Benz',
            },
            {
                key: '12',
                vehicle_name: 'Porches',
            },
        ],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        vehicles: [
            {
                key: '21',
                vehicle_name: 'GLC',
            },
            {
                key: '22',
                vehicle_name: 'Mazda CX5',
            },
        ],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        vehicles: [
            {
                key: '31',
                vehicle_name: 'KIA Morning',
            },
        ],
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sydney No. 1 Lake Park',
        vehicles: [
            {
                key: '41',
                vehicle_name: 'Bike',
            },
        ],
    },
];
