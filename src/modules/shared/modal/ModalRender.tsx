import { Modal } from 'antd';
import React from 'react';
import classes from './modal-render.module.scss';

interface Props {
    open?: boolean;
    title?: React.ReactNode;
    children?: React.ReactNode;
    hideOkButton?: boolean;
    hideCancelButton?: boolean;
    hideFooter?: boolean;
    confirmLoading?: boolean;
    maskClosable?: boolean;
    buttonRender?: React.ReactNode;

    width?: number;
    top?: number;
    height?: string;

    handleSubmit?: () => void;
    handleOpen?: () => void;
    handleCancel?: () => void;
}

const ModalRender = ({
    open,
    title,
    children,
    hideOkButton,
    hideCancelButton,
    hideFooter,
    confirmLoading,
    maskClosable,
    buttonRender,
    handleSubmit,
    handleCancel,
    top = 5,
    width = 960,
    height = 'calc(100vh - 160px)',
}: Props) => {
    return (
        <>
            {buttonRender}
            {/* <motion.div
                viewport={{ once: true }}
                initial={{ y: -50, opacity: 0.5 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            > */}
                <Modal
                    title={title}
                    open={open}
                    onOk={handleSubmit}
                    onCancel={handleCancel}
                    okText={'Apply'}
                    cancelText={'Cancel'}
                    okButtonProps={{ hidden: hideOkButton ? true : false }}
                    cancelButtonProps={{
                        hidden: hideCancelButton ? true : false,
                    }}
                    footer={hideFooter && null}
                    confirmLoading={confirmLoading}
                    maskClosable={maskClosable}
                    // getContainer="#content"
                    centered
                    width={width}
                    className="modal-container"
                    style={{ top: top }}
                >
                    <div
                        className={classes.modalContent}
                        style={{ height: height }}
                    >
                        {children}
                    </div>
                </Modal>
            {/* </motion.div> */}
        </>
    );
};

export default ModalRender;
