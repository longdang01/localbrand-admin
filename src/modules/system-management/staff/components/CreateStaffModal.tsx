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
    Radio,
    RadioChangeEvent,
    Row,
    Select,
    Tooltip,
    Typography,
    UploadFile,
    UploadProps,
    notification,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import { checkImageExists } from '@/utils/image';
import Upload, { RcFile } from 'antd/es/upload';
import {
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
    FORMAT_DATE,
    ROLES,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import { uploadFile } from '@/services/upload.service';
import { CACHE_STAFF, useCreateStaff } from '@/loaders/staff.loader';
import { queryClient } from '@/lib/react-query';
import dayjs from 'dayjs';

const CreateStaffModal = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'system' });
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState<boolean>(true);
    const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

    const createStaff = useCreateStaff({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_STAFF.SEARCH]);

                notification.success({
                    message: t('staff.create_success'),
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
        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: noImage,
            },
        ]);
    }, [isOpen]);

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
                url: noImage,
            },
        ]);

        form.setFieldValue('picture', '');
    };

    const handleChangeDate: DatePickerProps['onChange'] = (
        _,
        dateString:any,
    ) => {
        form.setFieldValue('dob', dateString ? dayjs(dateString, FORMAT_DATE) : "");
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.dob = dayjs(values.dob).format("YYYY-MM-DD");

                switch (isUpload) {
                    case true:
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
                        break;
                }

                createStaff.mutate({
                    ...values,
                    user: "",
                    _id: ""
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('staff.validate_form'),
                });
            });
    };
    return (
        <>
            <ModalRender
                customHeader={true}
                title={<Typography.Text>{t('staff.create')}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t('staff.create')}>
                        <Button type="primary" onClick={handleOpen}>
                            {t('staff.create')}
                        </Button>
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={loadingAvatar || createStaff?.isLoading}
            >
                <Form form={form}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={16} lg={16}>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.username')}
                                name="username"
                                rules={[...RULES_FORM.required, ...RULES_FORM.username]}
                            >
                                <Input
                                    placeholder={t('staff.fields.username')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.password')}
                                name="password"
                                rules={[...RULES_FORM.required, ...RULES_FORM.password]}
                            >
                                <Input.Password
                                    placeholder={t('staff.fields.password')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t(
                                    'staff.fields.role',
                                )}
                                name="role"
                                rules={[...RULES_FORM.required]}
                            >
                                <Select
                                    options={ROLES}
                                    placeholder={t(
                                        'staff.fields.role',
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.staff_name')}
                                name="staffName"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t('staff.fields.staff_name')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.dob')}
                                name="dob"
                                rules={[...RULES_FORM.required]}
                            >
                                <DatePicker
                                    onChange={handleChangeDate} format={FORMAT_DATE}
                                    placeholder={t('staff.fields.dob')}
                                    style={{width: "100%"}}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.email')}
                                name="email"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t('staff.fields.email')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.phone')}
                                name="phone"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t('staff.fields.phone')}
                                />
                            </FormItem>
                            <FormItem
                                labelCol={{ span: 7 }}
                                label={t('staff.fields.address')}
                                name="address"
                                rules={[...RULES_FORM.required]}
                            >
                                <Input
                                    placeholder={t('staff.fields.address')}
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
                                            {t('staff.url')}
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
                                                                    'staff.image_url_invalid',
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
                                        placeholder={t('staff.url')}
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
                                        {t('staff.upload')}
                                    </Radio>
                                    <Radio value={false}>{t('staff.url')}</Radio>
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
                                        showRemoveIcon: isUpload ? true : false,
                                    }}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    className="upload-container"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    {fileList.length < 1 && '+ Upload'}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </ModalRender>
        </>
    );
};

export default CreateStaffModal;
