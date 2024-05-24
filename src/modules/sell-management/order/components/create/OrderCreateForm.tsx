import ProductTable from './ProductTable';
import OrderCreateInfo from './OrderCreateInfo';

interface Props {}

const OrderCreateForm = ({}: Props) => {
    return (
        <>
            <ProductTable />

            <OrderCreateInfo />
        </>
    );
};

export default OrderCreateForm;
