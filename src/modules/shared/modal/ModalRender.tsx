import { Button, Flex, Modal, theme } from 'antd';
import React from 'react';
import classes from './modal-render.module.scss';
import { CloseOutlined } from '@ant-design/icons';
import { customColorsWhiteText } from '@/utils/colors';

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
    customHeader?: boolean;

    handleSubmit?: () => void;
    handleOpen?: () => void;
    handleCancel?: () => void;
}

const { useToken } = theme;

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
    top = 0,
    width = 960,
    height = 'calc(100vh - 180px)',
    customHeader = false,
}: Props) => {
    const { token } = useToken();

    return (
        <>
            {buttonRender}
            <Modal
                title={customHeader ? null : <div style={{ fontWeight: "bold" }}>{title}</div>}
                closeIcon={customHeader ? false : true}
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
                className={
                    !customHeader ? 'modal-container' : 'modal-custom-header'
                }
                style={{ top: top }}
            >
                {customHeader && (
                    <Flex
                        align="center"
                        justify="space-between"
                        className={'modal-header'}
                        style={{ background: token.colorPrimaryText, 
                            boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1019607843)"
                        }}
                    >
                        <div
                            className={
                                customColorsWhiteText.find(
                                    (color) => color == token.colorPrimaryText,
                                )
                                    ? 'title-header'
                                    : ''
                            }
                            style={{ fontWeight: "bold" }}
                        >
                            {title}
                        </div>
                        <Button
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={handleCancel}
                        />
                    </Flex>
                )}
                <div
                    className={classes.modalContent}
                    style={{ height: height }}
                >
                    {children}
                </div>
            </Modal>
        </>
    );
};

export default ModalRender;
