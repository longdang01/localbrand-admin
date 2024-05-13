import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    DatePicker,
    DatePickerProps,
    Form,
    Input,
    Row,
    Tooltip,
    Typography,
    notification,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import {
    CONFIG_SLUGIFY,
    FORMAT_DATE,
} from '@/constants/config';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import slugify from 'slugify';
import {
    CACHE_COLLECTION,
    useCreateCollection,
} from '@/loaders/collection.loader';
import { queryClient } from '@/lib/react-query';
import dayjs from 'dayjs';

const CreateCollectionModal = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [textContent, setTextContent] = useState<string>('');

    const createCollection = useCreateCollection({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLLECTION.SEARCH]);

                notification.success({
                    message: t('collection.create_success'),
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

    useEffect(() => {
        form.resetFields();
        setTextContent('');
        
    }, [isOpen]);

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleAutoFillPath = (e: any) => {
        form.setFieldValue('path', slugify(e?.target?.value, CONFIG_SLUGIFY));
    };

    const handleChangeDate: DatePickerProps['onChange'] = (
        _,
        dateString:any,
    ) => {
        form.setFieldValue('releaseDate', dayjs(dateString, FORMAT_DATE));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");

                createCollection.mutate({
                    ...values,
                    description: textContent,
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('collection.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('collection.create')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('collection.create')}>
                        <Button type="primary" onClick={handleOpen}>
                            {t('collection.create')}
                        </Button>
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={createCollection?.isLoading}
            >
                <Form form={form}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={24} lg={24}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('collection.fields.collection_name')}
                                name="collectionName"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t(
                                        'collection.fields.collection_name',
                                    )}
                                    onChange={handleAutoFillPath}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('collection.fields.path')}
                                name="path"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t('collection.fields.path')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('collection.fields.release_date')}
                                name="releaseDate"
                                rules={[...RULES_FORM.required]}
                            >
                                <DatePicker onChange={handleChangeDate} format={FORMAT_DATE} style={{ width: "100%"}}/>
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
            </ModalRender>
        </>
    );
};

export default CreateCollectionModal;
