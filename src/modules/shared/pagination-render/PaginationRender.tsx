import { PAGE_INDEX, PAGE_SIZE } from '@/constants/config';
import { Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';

interface Props {
    current?: number;
    total?: number;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
}

const PaginationRender = ({
    total,
    showQuickJumper = true,
    showSizeChanger = true,
}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChangePage = (pageIndex: number, pageSize: number) => {
        searchParams.set(PAGE_INDEX, String(pageIndex));
        searchParams.set(PAGE_SIZE, String(pageSize));
        setSearchParams(searchParams)
    };

    return (
        <>
            <Pagination
                showQuickJumper={showQuickJumper}
                showSizeChanger={showSizeChanger}
                current={Number(searchParams.get(PAGE_INDEX)) || 1}
                pageSize={Number(searchParams.get(PAGE_SIZE)) || 10}
                total={total}
                onChange={handleChangePage}
            />
        </>
    );
};

export default PaginationRender;
