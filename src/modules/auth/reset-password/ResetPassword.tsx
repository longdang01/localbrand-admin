import Form, { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import LayoutForm from '../layout-form/LayoutForm';
import classes from '../layout-form/layout-form.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography, notification } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';
import { RULES_FORM } from '@/utils/validator';
import { useResetPassword } from '@/loaders/auth.loader';
import { logout } from '@/services/user.service';

const ResetPassword = () => {
    const { t } = useTranslation('translation');
    const [form] = useForm();
    const { id, token } = useParams();
    const navigate = useNavigate();


    const resetPassword = useResetPassword({
        config: {
            onSuccess: async () => {
                notification.success({
                    message: t('messages.reset_password_success'),
                });
                const userStorage = localStorage.getItem('user');
                if(userStorage) await logout();
                
                localStorage.clear();
                navigate(LOGIN_PATH);
            },
            onError: (error) => {
                notification.error({
                    message: error?.response?.data?.detail || error?.message,
                });        
            }
        }
    })

    const handleSubmit =  () => {
        form.validateFields().then(async(values) => {
            resetPassword.mutate({
                ...values,
                id: id,
                token: token
            })

        }).catch(() => {
            notification.warning({
                message: t("messages.validate_form")
            })
        })
    }

    return (
        <>
            <LayoutForm>
                <div className={classes.layoutContainer}>
                    <div className={classes.title}>
                        {t('auth.reset_password.title')}
                    </div>
                    <div>
                        <Form form={form} className={classes.form} layout='vertical'>
                            <FormItem
                                className={classes.formItem}
                                name={'newPassword'}
                                rules={[
                                    ...RULES_FORM.required,
                                    ...RULES_FORM.password,
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    className={`${classes.formInput} ${classes.formPassword}`}
                                    placeholder={t('users.fields.password_new')}
                                    onPressEnter={handleSubmit}
                                ></Input.Password>
                            </FormItem>
                            <FormItem
                                className={classes.formItem}
                                name={'newConfirmPassword'}
                                dependencies={['newPassword']}
                                rules={[
                                    ...RULES_FORM.required,
                                    ...RULES_FORM.password,
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue(
                                                    'newPassword',
                                                ) === value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        'messages.error_confirm_password',
                                                    ),
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    className={`${classes.formInput} ${classes.formPassword}`}
                                    placeholder={t(
                                        'users.fields.password_new_confirm',
                                    )}
                                    onPressEnter={handleSubmit}
                                ></Input.Password>
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button 
                            className={classes.btnSubmit}
                            onClick={handleSubmit} 
                            loading={resetPassword?.isLoading}
                        >
                            {t('auth.reset_password.title')}
                        </Button>
                    </div>
                    <Flex
                        className={classes.footerContainer}
                        justify="center"
                        align="center"
                    >
                        <Typography.Text>{t('app.back')}</Typography.Text>
                        <Link to={LOGIN_PATH}>{t('auth.login.title')}</Link>
                    </Flex>
                </div>
            </LayoutForm>
        </>
    );
};

export default ResetPassword;
