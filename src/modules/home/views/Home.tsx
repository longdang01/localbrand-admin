import PageHeader from '@/modules/shared/page-header/Pageheader';
import { Button, Space } from 'antd';
import { homeBreadcrumbs } from '../constants/home-breadcrumb.constants';
import TableListRender from '@/modules/shared/table-render/list/TableListRender';
import { HOME_DATA } from '../constants/home-table.constants';

const Home = () => {

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

            <TableListRender data={HOME_DATA}/>
        </>
    );  
};

export default Home;
