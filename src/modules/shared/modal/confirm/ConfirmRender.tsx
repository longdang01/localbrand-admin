import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

interface Props {
    title?: React.ReactNode;
    content?: React.ReactNode;
    buttonRender?: React.ReactNode;

    handleConfirm?: () => void;
    handleCancel?: () => void;
}

const { confirm } = Modal;

const ConfirmRender = ({
    title,
    content,
    buttonRender,
    handleConfirm,
    handleCancel
}:Props) => {
    const handleShowConfirm = () => {
        confirm({
            title: title,
            icon: <ExclamationCircleFilled />,
            content: content,
            onOk: handleConfirm,
            onCancel: handleCancel,
          });
    }

    return <>   
        <div style={{ cursor: "pointer"}} onClick={handleShowConfirm}>
            {buttonRender}
        </div>
    </>
}

export default ConfirmRender;