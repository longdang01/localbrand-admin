import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import { Button, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const CreateDataCatalog = () => {
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
                title={<Typography.Text>{t("catalog.create")}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t("catalog.create")}>
                        <Button 
                            type="primary"
                            onClick={handleOpen}
                        >{t('catalog.create')}</Button>
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
            >
                
            </ModalRender>
        </>
    );
};

export default CreateDataCatalog;
