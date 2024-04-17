import { Breadcrumb } from "antd";
import { BreadcrumbItemType, BreadcrumbSeparatorType } from "antd/es/breadcrumb/Breadcrumb";

interface Props {
    items?: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[] | undefined; 
}

const BreadcrumbRender = ({items}:Props) => {

    return <>
        <Breadcrumb items={items} />
    </>
}

export default BreadcrumbRender;