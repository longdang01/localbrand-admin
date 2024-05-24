import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    Row,
    Tooltip,
    Typography,
    UploadFile,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { RULES_FORM } from '@/utils/validator';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import Upload, { RcFile } from 'antd/es/upload';
import {
    DEFAULT_NAME_FILE_LIST,
    DEFAULT_STATUS_FILE_LIST,
    DEFAULT_UID_FILE_LIST,
    FORMAT_DATE,
} from '@/constants/config';
import noImage from '@/assets/images/default/no-image.png';
import { useGetByIdCustomer } from '@/loaders/customer.loader';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatDate } from '@/utils/date';

interface Props {
    id: string;
}

const { useToken } = theme;

const EditCustomerModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'sell' });
    const { token } = useToken();
    const { open, close, isOpen } = useDisclosure();
    const [form] = useForm();

    const currentCustomer = useGetByIdCustomer({
        id,
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                    email: response?.user?.email,
                    username: response?.user?.username,
                    password: response?.user?.password,
                });
                form.setFieldValue('upload', '');
                setFileList([
                    {
                        uid: DEFAULT_UID_FILE_LIST,
                        name: DEFAULT_NAME_FILE_LIST,
                        status: DEFAULT_STATUS_FILE_LIST,
                        url: response?.picture || noImage,
                    },
                ]);
                form.setFieldValue(
                    'dob',
                    response?.dob
                        ? dayjs(
                              formatDate(
                                  response?.dob,
                                  'YYYY-MM-DD',
                                  'DD/MM/YYYY',
                              ),
                              'DD/MM/YYYY',
                          )
                        : '',
                );
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const [fileList, setFileList] = useState<any[]>([]);

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

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('customer.update')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('customer.update')}>
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
                hideOkButton
            >
                {currentCustomer?.isLoading ? (
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
                                    label={t('customer.fields.username')}
                                    name={'username'}
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.username,
                                    ]}
                                >
                                    <Input
                                        placeholder={t('customer.fields.username')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('customer.fields.email')}
                                    name="email"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('customer.fields.email')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('customer.fields.customer_name')}
                                    name="customerName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'customer.fields.customer_name',
                                        )}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('customer.fields.dob')}
                                    name="dob"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <DatePicker
                                        format={FORMAT_DATE}
                                        placeholder={t('customer.fields.dob')}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('customer.fields.phone')}
                                    name="phone"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('customer.fields.phone')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('customer.fields.address')}
                                    name="address"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'customer.fields.address',
                                        )}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={24} md={8} lg={8}>
                                <Form.Item name={'upload'}>
                                    <Upload
                                        listType="picture-circle"
                                        name="avatar"
                                        fileList={fileList}
                                        onPreview={onPreview}
                                        showUploadList={{
                                            // showPreviewIcon: false,
                                            showRemoveIcon: false,
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

export default EditCustomerModal;
