import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';

const EditModalRender = () => {
    const { open, close, isOpen } = useDisclosure();

    const handleOpen = () => {
        open();
    }

    const handleClose = () => {
        close();
    }

    return (
        <>
            <ModalRender
                title={<Typography.Text>Update Draft</Typography.Text>}
                buttonRender={
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            className="btn-edit"
                            onClick={handleOpen}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
            >
                
            </ModalRender>
        </>
    );
};

export default EditModalRender;
