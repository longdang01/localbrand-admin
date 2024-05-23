import ProductTable from './ProductTable';
import ImportBillCreateInfo from './ImportBillCreateInfo';

interface Props {}

const ImportBillCreateForm = ({}: Props) => {
    return (
        <>
            <ProductTable />

            <ImportBillCreateInfo />
        </>
    );
};

export default ImportBillCreateForm;
