import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Tooltip,
    Typography,
    UploadFile,
    UploadProps,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import { checkImageExists } from '@/utils/image';
import Upload, { RcFile } from 'antd/es/upload';
import {
    CONFIG_SLUGIFY,
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import slugify from 'slugify';
import { uploadFile } from '@/services/upload.service';
import {
    CACHE_SUPPLIER,
    useGetByIdSupplier,
    useUpdateSupplier,
} from '@/loaders/supplier.loader';
import { queryClient } from '@/lib/react-query';
import { EditOutlined } from '@ant-design/icons';

interface Props {
    id: string;
}

const { useToken } = theme;

const EditSupplierModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState<boolean>(true);
    const [textContent, setTextContent] = useState<string>('');
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

    const currentSupplier = useGetByIdSupplier({
        id,
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                });
                form.setFieldValue('upload', '');
                setTextContent(response?.description);
                setFileList([
                    {
                        uid: DEFAULT_UID_FILE_LIST,
                        name: DEFAULT_NAME_FILE_LIST,
                        status: DEFAULT_STATUS_FILE_LIST,
                        url: response?.picture || noImage,
                    },
                ]);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const updateSupplier = useUpdateSupplier({
        id: id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_SUPPLIER.SEARCH]);

                notification.success({
                    message: t('supplier.update_success'),
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

    const [fileList, setFileList] = useState<any[]>([]);

    const onChange: UploadProps['onChange'] = async ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };

    const onRemove: UploadProps['onRemove'] = async () => {
        setFileList([]);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChangeUrl = (e: any) => {
        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: e?.target?.value || noImage,
            },
        ]);
    };

    const handleChangeRatio = (e: RadioChangeEvent) => {
        setIsUpload(e.target.value);

        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: currentSupplier?.data?.picture || noImage,
            },
        ]);
        form.setFieldValue('picture', currentSupplier?.data?.picture);
    };

    const handleAutoFillPath = (e: any) => {
        form.setFieldValue('path', slugify(e?.target?.value, CONFIG_SLUGIFY));
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.picture =
                    values?.picture || currentSupplier?.data?.picture;

                if (isUpload && values?.upload) {
                    let url = '';
                    if (values?.upload?.fileList?.[0]) {
                        const currentFile =
                            values?.upload?.fileList?.[0].originFileObj;
                        if (currentFile) delete currentFile['uid'];
                        const formData: any = new FormData();
                        formData.append('image', currentFile);

                        setLoadingAvatar(true);
                        const result = await uploadFile(formData);
                        setLoadingAvatar(false);

                        url = result.data.url;
                    }
                    values.picture = url;
                }

                updateSupplier.mutate({
                    ...values,
                    description: textContent,
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('supplier.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('supplier.update')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('supplier.update')}>
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
                confirmLoading={loadingAvatar || updateSupplier?.isLoading}
            >
                {currentSupplier?.isLoading ? (
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
                            <Col span={24} md={16} lg={16}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('supplier.fields.supplier_name')}
                                    name="supplierName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'supplier.fields.supplier_name',
                                        )}
                                        onChange={handleAutoFillPath}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('supplier.fields.address')}
                                    name="address"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'supplier.fields.address',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('supplier.fields.phone')}
                                    name="phone"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.phone,
                                    ]}
                                >
                                    <Input
                                        placeholder={t('supplier.fields.phone')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('supplier.fields.email')}
                                    name="email"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.email,
                                    ]}
                                >
                                    <Input
                                        placeholder={t('supplier.fields.email')}
                                    />
                                </FormItem>
                                {!isUpload && (
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        name={'picture'}
                                        label={
                                            <Typography.Text
                                                style={{ marginLeft: 10 }}
                                            >
                                                {t('supplier.url')}
                                            </Typography.Text>
                                        }
                                        rules={[
                                            {
                                                validator: async (_, value) => {
                                                    if (value) {
                                                        try {
                                                            await checkImageExists(
                                                                value,
                                                            );
                                                            return Promise.resolve();
                                                        } catch (error) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    t(
                                                                        'supplier.image_url_invalid',
                                                                    ),
                                                                ),
                                                            );
                                                        }
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            onChange={handleChangeUrl}
                                            placeholder={t('supplier.url')}
                                        />
                                    </Form.Item>
                                )}
                                <Flex
                                    align="center"
                                    justify="end"
                                    style={{ marginBottom: 24 }}
                                >
                                    <Radio.Group
                                        onChange={handleChangeRatio}
                                        value={isUpload}
                                    >
                                        <Radio value={true}>
                                            {t('supplier.upload')}
                                        </Radio>
                                        <Radio value={false}>
                                            {t('supplier.url')}
                                        </Radio>
                                    </Radio.Group>
                                </Flex>
                            </Col>
                            <Col span={24} md={8} lg={8}>
                                <Form.Item name={'upload'}>
                                    <Upload
                                        listType="picture-circle"
                                        name="avatar"
                                        fileList={fileList}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                        onRemove={onRemove}
                                        showUploadList={{
                                            // showPreviewIcon: false,
                                            showRemoveIcon: isUpload
                                                ? true
                                                : false,
                                        }}
                                        beforeUpload={() => false}
                                        accept="image/*"
                                        className="upload-container"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {fileList.length < 1 && '+ Upload'}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* RICH TEXT EDITOR */}
                        <ReactQuill
                            theme="snow"
                            value={textContent}
                            onChange={setTextContent}
                            modules={REACT_QUILL_MODULES}
                            formats={REACT_QUILL_FORMAT}
                            style={{ height: 200 }}
                        />
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default EditSupplierModal;
