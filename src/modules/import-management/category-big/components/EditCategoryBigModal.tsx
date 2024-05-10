import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const EditCategoryBigModal = () => {
    const { t } = useTranslation("translation", { keyPrefix: "import"});
 
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
                title={<Typography.Text>{t("category_big.update")}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t("category_big.update")}>
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

export default EditCategoryBigModal;
