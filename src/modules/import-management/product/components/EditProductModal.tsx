import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const EditDataCatalog = () => {
    const { t } = useTranslation("translation", { keyPrefix: "data_warehouse"});
 
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
                customHeader={true}
                title={<Typography.Text>{t("catalog.update")}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t("catalog.update")}>
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

export default EditDataCatalog;
