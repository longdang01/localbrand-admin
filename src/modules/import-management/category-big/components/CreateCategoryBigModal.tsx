import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import { Button, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const CreateCategoryBigModal = () => {
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
                title={<Typography.Text>{t("category_big.create")}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t("category_big.create")}>
                        <Button 
                            type="primary"
                            onClick={handleOpen}
                        >{t('category_big.create')}</Button>
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
            >
                
            </ModalRender>
        </>
    );
};

export default CreateCategoryBigModal;
