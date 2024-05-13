import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    DatePicker,
    DatePickerProps,
    Flex,
    Form,
    Input,
    Row,
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
    CONFIG_SLUGIFY,
    FORMAT_DATE,
} from '@/constants/config';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import slugify from 'slugify';
import {
    CACHE_COLLECTION,
    useGetByIdCollection,
    useUpdateCollection,
} from '@/loaders/collection.loader';
import { queryClient } from '@/lib/react-query';
import { EditOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/date';
import dayjs from 'dayjs';

interface Props {
    id: string;
}

const { useToken } = theme;

const EditCategoryBigModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [textContent, setTextContent] = useState<string>('');

    const currentCollection = useGetByIdCollection({
        id,
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                });
                form.setFieldValue('releaseDate', dayjs(formatDate(response?.releaseDate, "YYYY-MM-DD", "DD/MM/YYYY"), "DD/MM/YYYY"));
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

    const updateCollection = useUpdateCollection({
        id: id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLLECTION.SEARCH]);

                notification.success({
                    message: t('collection.update_success'),
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

    const handleAutoFillPath = (e: any) => {
        form.setFieldValue('path', slugify(e?.target?.value, CONFIG_SLUGIFY));
    };

    const handleChangeDate: DatePickerProps['onChange'] = (_, dateString:any) => {
        form.setFieldValue('releaseDate', dayjs(dateString, FORMAT_DATE));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");
                
                updateCollection.mutate({
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
                    <Typography.Text>{t('collection.update')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('collection.update')}>
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
                confirmLoading={updateCollection?.isLoading}
            >
                {currentCollection?.isLoading ? (
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
                                        'collection.fields.collection_name',
                                    )}
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
                                        placeholder={t(
                                            'collection.fields.path',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('collection.fields.release_date')}
                                    rules={[...RULES_FORM.required]}
                                    name={"releaseDate"}
                                >
                                    <DatePicker
                                        onChange={handleChangeDate}
                                        format={FORMAT_DATE}
                                        style={{ width: '100%' }}
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

export default EditCategoryBigModal;
