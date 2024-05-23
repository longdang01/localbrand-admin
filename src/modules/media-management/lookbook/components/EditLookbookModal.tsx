import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Tooltip,
    Typography,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import {
    MAX_PAGE_SIZE,
    MIN_PAGE_SIZE,
} from '@/constants/config';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import {
    CACHE_LOOKBOOK,
    useGetByIdLookbook,
    useUpdateLookbook,
} from '@/loaders/lookbook.loader';
import { queryClient } from '@/lib/react-query';
import { EditOutlined } from '@ant-design/icons';
import { useSearchCollections } from '@/loaders/collection.loader';
import { CollectionProps } from '@/models/collection';

interface Props {
    id: string;
}

const { useToken } = theme;

const EditLookbookModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'media' });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [textContent, setTextContent] = useState<string>('');

    const searchCollections = useSearchCollections({
        params: {
            pageIndex: MIN_PAGE_SIZE,
            pageSize: MAX_PAGE_SIZE,
            searchData: '',
        },
    });

    const currentLookbook = useGetByIdLookbook({
        id,
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                    collectionInfo: response?.collectionInfo?._id
                });
                setTextContent(response?.description);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const updateLookbook = useUpdateLookbook({
        id: id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_LOOKBOOK.SEARCH]);

                notification.success({
                    message: t('lookbook.update_success'),
                });

                handleClose?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                
                updateLookbook.mutate({
                    ...values,
                    description: textContent,
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('lookbook.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('lookbook.update')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('lookbook.update')}>
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
                handleSubmit={handleSubmit}
                confirmLoading={updateLookbook?.isLoading}
            >
                {currentLookbook?.isLoading ? (
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <div
                            className="loader"
                            style={{ background: token.colorPrimary }}
                        ></div>
                    </Flex>
                ) : (
                    <Form form={form}>
                        <Row gutter={[24, 24]}>
                            <Col span={24} md={24} lg={24}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t(
                                        'lookbook.fields.lookbook_name',
                                    )}
                                    name="lookbookName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'lookbook.fields.lookbook_name',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t(
                                        'lookbook.fields.collection',
                                    )}
                                    name="collectionInfo"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        loading={
                                            searchCollections?.isLoading ||
                                            currentLookbook?.isLoading
                                        }
                                        value={currentLookbook?.data?.collectionInfo?._id}
                                        options={searchCollections?.data?.collections?.map(
                                            (collection: CollectionProps) => ({
                                                label: collection?.collectionName,
                                                value: collection?._id,
                                            }),
                                        )}
                                        placeholder={t(
                                            'lookbook.fields.collection',
                                        )}
                                    />
                                </FormItem>
                                
                            </Col>
                            
                        </Row>

                        {/* RICH TEXT EDITOR */}
                        <ReactQuill
                            theme="snow"
                            value={textContent}
                            onChange={setTextContent}
                            modules={REACT_QUILL_MODULES}
                            formats={REACT_QUILL_FORMAT}
                            style={{ height: 300 }}
                        />
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default EditLookbookModal;
