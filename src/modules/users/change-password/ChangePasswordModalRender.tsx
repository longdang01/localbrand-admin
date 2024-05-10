import { useForm } from 'antd/es/form/Form';
import ModalRender from '../../shared/modal/ModalRender';
import { useTranslation } from 'react-i18next';
import { Form, Input, notification } from 'antd';
import { RULES_FORM } from '@/utils/validator';
import { useChangePassword, useGetMe } from '@/loaders/auth.loader';

interface Props {
    open?: boolean;
    handleClose?: () => void;
}

const ChangePasswordModalRender = ({ open, handleClose }: Props) => {
    const { t } = useTranslation('translation');
    const [form] = useForm();
    const currentUsers = useGetMe({
        enabled: open
    })

    const changePassword = useChangePassword({
        config: {
            onSuccess: (_) => {
                notification.success({
                    message: t('messages.change_password_success'),
                });

                setTimeout(() => {
                    localStorage.clear();
                    location.reload();
                }, 300);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.response?.data?.detail || error?.message,
                });
            },
        },
    });

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {

                changePassword.mutate(
                    {
                        ...values,
                        username: currentUsers?.data?.username
                    }
                );
            })
            .catch(() => {
                notification.warning({ message: t('messages.validate_form') });
            });
    };

    return (
        <>
            <ModalRender
                title={t('users.change_password')}
                width={700}
                height={'324px'}
                customHeader={true}
                open={open}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
                confirmLoading={changePassword.isLoading}
            >
                <Form form={form}>
                    <Form.Item
                        labelCol={{ span: 7 }}
                        name={'oldPassword'}
                        label={t('users.fields.password_current')}
                        hasFeedback
                        rules={[
                            ...RULES_FORM.required,
                            ...RULES_FORM.password,
                        ]}
                    >
                        <Input.Password
                            placeholder={t('users.fields.password_current')}
                        ></Input.Password>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 7 }}
                        name={'newPassword'}
                        label={t('users.fields.password_new')}
                        rules={[
                            ...RULES_FORM.required,
                            ...RULES_FORM.password,
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            placeholder={t('users.fields.password_new')}
                        ></Input.Password>
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 7 }}
                        name={'newPasswordConfirm'}
                        label={t('users.fields.password_new_confirm')}
                        dependencies={['newPassword']}
                        rules={[
                            ...RULES_FORM.required,
                            ...RULES_FORM.password,
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('newPassword') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            t('messages.error_confirm_password'),
                                        ),
                                    );
                                },
                            }),
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            placeholder={t('users.fields.password_new_confirm')}
                        ></Input.Password>
                    </Form.Item>
                </Form>
            </ModalRender>
        </>
    );
};

export default ChangePasswordModalRender;
