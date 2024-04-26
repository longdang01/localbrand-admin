import {
    Col,
    Flex,
    Form,
    Input,
    Radio,
    RadioChangeEvent,
    Row,
    Upload,
    UploadFile,
    UploadProps,
    notification,
} from 'antd';
import ModalRender from '../../shared/modal/ModalRender';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import classes from './users-modal.module.scss';
import { CACHE_AUTH, useGetMe } from '@/loaders/auth.loader';
import {
    BASE_URL,
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
} from '@/constants/config';
import { checkImageExists, generateImage } from '@/utils/image';
import { RULES_FORM } from '@/utils/validator';
import { uploadImage } from '@/services/upload.service';
import defaultAvatar from '@/assets/images/avatars/default.png';
import { useUpdateProfile } from '@/loaders/users.loader';
import { queryClient } from '@/lib/react-query';

interface Props {
    open?: boolean;
    handleClose?: () => void;
}

const UsersModalRender = ({ open, handleClose }: Props) => {
    const { t } = useTranslation('translation');
    const [form] = useForm();
    const [isUpload, setIsUpload] = useState(true);

    const updateProfile = useUpdateProfile({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_AUTH.AUTH_ME]);
                
                notification.success({
                    message: t("messages.update_success")
                })

                handleClose?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    // binding value for form
    const currentUsers = useGetMe({
        config: {
            onSuccess: (response) => {
                if (response) {
                    handleBindingData(response);
                }
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: open
    });

    const handleBindingData = (data: any) => {
        form.setFieldsValue({
            ...data,
            avatar_url:
                generateImage(`${BASE_URL}/${data?.avatar_url}`) ||
                data?.avatar_url,
        });

        setFileList([
            {
                uid: DEFAULT_UID_FILE_LIST,
                name: DEFAULT_NAME_FILE_LIST,
                status: DEFAULT_STATUS_FILE_LIST,
                url:
                    generateImage(`${BASE_URL}/${data?.avatar_url}`) ||
                    data?.avatar_url ||
                    defaultAvatar,
            },
        ]);
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
                url: e?.target?.value || defaultAvatar,
            },
        ]);
    };

    const handleChangeRatio = (e: RadioChangeEvent) => {
        setIsUpload(e.target.value);

        handleBindingData(currentUsers?.data);
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                switch (isUpload) {
                    case true:
                        let url = '';
                        if (values?.upload?.fileList?.[0]) {
                            const currentFile =
                                values?.upload?.fileList?.[0].originFileObj;
                            if (currentFile) delete currentFile['uid'];
                            const formData: any = new FormData();
                            formData.append('file', currentFile);

                            const result = await uploadImage(formData);
                            url = result.data[0].file_url;
                        }
                        values.avatar_url = url;
                        break;
                }

                updateProfile.mutate(values);
            })
            .catch(() => {
                notification.warning({ message: t('messages.validate_form') });
            });
    };

    return (
        <>
            <ModalRender
                title={t('users.profile')}
                height={'324px'}
                customHeader={true}
                open={open}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={updateProfile?.isLoading}
            >
                <Form form={form}>
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={16} lg={16}>
                            <Form.Item
                                labelCol={{ span: 6 }}
                                name={'username'}
                                label={t('users.fields.username')}
                                rules={[...RULES_FORM.required]}
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 6 }}
                                name={'full_name'}
                                label={t('users.fields.full_name')}
                                rules={[...RULES_FORM.full_name]}
                            >
                                <Input />
                            </Form.Item>
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
                                        {t('users.fields.upload')}
                                    </Radio>
                                    <Radio value={false}>
                                        {t('users.fields.url')}
                                    </Radio>
                                </Radio.Group>
                            </Flex>
                            {!isUpload && (
                                <Form.Item
                                    labelCol={{ span: 6 }}
                                    name={'avatar_url'}
                                    label={t('users.fields.url')}
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
                                                                    'validators.image_url_invalid',
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
                                    <Input onChange={handleChangeUrl} />
                                </Form.Item>
                            )}
                        </Col>
                        <Col span={24} md={8} lg={8}>
                            <Form.Item name={'upload'}>
                                <Upload
                                    listType="picture-card"
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
                                    className={classes.uploadContainer}
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

export default UsersModalRender;
