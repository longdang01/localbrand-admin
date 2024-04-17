import { Pagination } from 'antd';

interface Props {
    current?: number;
    total?: number;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
}

const PaginationRender = ({
    current,
    total,
    showQuickJumper = true,
    showSizeChanger = true,
}: Props) => {
    const handleChangePage = (_: number, __: number) => {};

    return (
        <>
            <Pagination
                showQuickJumper={showQuickJumper}
                showSizeChanger={showSizeChanger}
                current={current}
                total={total}
                onChange={handleChangePage}
            />
        </>
    );
};

export default PaginationRender;
