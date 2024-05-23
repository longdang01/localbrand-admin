import {
    Col,
    DatePicker,
    DatePickerProps,
    Flex,
    Form,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Typography,
    Upload,
    UploadFile,
    UploadProps,
    notification,
    theme,
} from 'antd';
import ModalRender from '../../shared/modal/ModalRender';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import { CACHE_AUTH, useGetMe } from '@/loaders/auth.loader';
import {
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
    FORMAT_DATE,
} from '@/constants/config';
import { checkImageExists } from '@/utils/image';
import { RULES_FORM } from '@/utils/validator';
import { uploadFile } from '@/services/upload.service';
import { queryClient } from '@/lib/react-query';
import { CACHE_STAFF, useUpdateStaff } from '@/loaders/staff.loader';
import dayjs from 'dayjs';
import { formatDate } from '@/utils/date';
import FormItem from 'antd/es/form/FormItem';
import noImage from '@/assets/images/default/no-image.png';

interface Props {
    open?: boolean;
    handleClose?: () => void;
}
const { useToken } = theme;


const UsersModalRender = ({ open, handleClose }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: "system"});
    const {token } = useToken();
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState(true);
    const [loadingAvatar, setLoadingAvatar] = useState(false);

    // binding value for form
    const currentUsers = useGetMe({
        config: {
            onSuccess: (response) => {
                if (response?.staff && response?.user) {
                    handleBindingData({
                        ...response?.staff,
                        user: response?.user,
                        username: response?.user?.username,
                        email: response?.user?.email,
                        password: response?.user?.password,
                    });

                    form.setFieldValue(
                        'dob',
                        response?.staff?.dob
                            ? dayjs(
                                  formatDate(
                                      response?.staff?.dob,
                                      'YYYY-MM-DD',
                                      'DD/MM/YYYY',
                                  ),
                                  'DD/MM/YYYY',
                              )
                            : '',
                    );
                }
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: open,
    });

    const updateStaff = useUpdateStaff({
        id: currentUsers?.data?.staff?._id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_STAFF.SEARCH]);
                queryClient.invalidateQueries([CACHE_AUTH.AUTH_ME]);

                notification.success({
                    message: t('staff.update_success'),
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

    const handleBindingData = (data: any) => {
        form.setFieldsValue({
            ...data,
        });

        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url: data?.picture || noImage,
            },
        ]);
    };

    const handleChangeDate: DatePickerProps['onChange'] = (
        _,
        dateString: any,
    ) => {
        form.setFieldValue(
            'dob',
            dateString ? dayjs(dateString, FORMAT_DATE) : '',
        );
    };
    
    // #region Handle Upload Image
    const [fileList, setFileList] = useState<any[]>([]);

    // change file upload
    const onChange: UploadProps['onChange'] = async ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };

    // delete file upload
    const onRemove: UploadProps['onRemove'] = async () => {
        setFileList([]);
    };

    // show preview file upload
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
    // #endregion

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
                url: currentUsers?.data?.staff?.picture || noImage,
            },
        ]);
        form.setFieldValue('picture', currentUsers?.data?.staff?.picture || '');

        // handleBindingData({
        //     ...currentUsers?.data?.staff,
        //     user: currentUsers?.data?.user,
        //     username: currentUsers?.data?.user?.username,
        // });
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                values.dob = dayjs(values.dob).format(
                    'YYYY-MM-DD',
                );
                
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

                updateStaff.mutate({
                    ...currentUsers?.data?.staff,
                    user: currentUsers?.data?.user,
                    ...values,
                });
            })
            .catch(() => {
                notification.warning({ message: t('messages.validate_form') });
            });
    };

    return (
        <>
            <ModalRender
                title={t('staff.profile')}
                height={'324px'}
                customHeader={true}
                open={open}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={updateStaff?.isLoading || loadingAvatar}
                okText=""
            >
                {currentUsers?.isLoading ? (
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
                                    label={t('staff.fields.username')}
                                    name={'username'}
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.username,
                                    ]}
                                >
                                    <Input
                                        placeholder={t('staff.fields.username')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('staff.fields.password')}
                                    name="password"
                                    hidden
                                >
                                    <Input
                                        placeholder={t('staff.fields.password')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('staff.fields.staff_name')}
                                    name="staffName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'staff.fields.staff_name',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('staff.fields.dob')}
                                    name="dob"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <DatePicker
                                        onChange={handleChangeDate}
                                        format={FORMAT_DATE}
                                        placeholder={t('staff.fields.dob')}
                                        style={{ width: '100%' }}
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
                                        <Radio value={false}>
                                            {t('staff.url')}
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
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default UsersModalRender;
