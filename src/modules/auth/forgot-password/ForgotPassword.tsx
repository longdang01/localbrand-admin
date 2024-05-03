import Form, { useForm } from 'antd/es/form/Form';
import classes from '../layout-form/layout-form.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import LayoutForm from '../layout-form/LayoutForm';
import { Link } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';
import { useForgotPassword } from '@/loaders/auth.loader';
import { RULES_FORM } from '@/utils/validator';

const ForgotPassword = () => {
    const { t } = useTranslation('translation');
    const [form] = useForm();
    const forgotPassword = useForgotPassword({
        config: {
            onSuccess: (_) => {
                notification.success({
                    message: t('messages.request_success'),
                });
            },
            onError: (error) => {
                notification.error({
                    message: error?.response?.data?.detail || error?.message,
                });                
            }
        }
    });

    const handleSubmit = () => {
        form.validateFields().then(async(values) => {
            forgotPassword.mutate(values)

        }).catch(() => {
            notification.warning({message: t("messages.validate_form")})
        })
    }

    return (
        <>
            <LayoutForm>
                <div className={classes.layoutContainer}>
                    <div className={classes.title}>
                        {t('auth.forget_password.title')}
                    </div>
                    <div>
                        <Form form={form} className={classes.form}>
                            <FormItem 
                                className={classes.formItem}
                                rules={[...RULES_FORM.email]}
                                name={"email"}
                            >
                                <Input
                                    className={classes.formInput}
                                    placeholder={t('auth.forget_password.email')}
                                    onPressEnter={handleSubmit}
                                />
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button 
                            className={classes.btnSubmit}
                            onClick={handleSubmit}
                            loading={forgotPassword?.isLoading}
                        >
                            {t('app.send_request')}
                        </Button>
                    </div>
                    <Flex
                        className={classes.footerContainer}
                        justify="center"
                        align="center"
                    >
                        <Typography.Text>
                            {t('app.back')}
                        </Typography.Text>
                        <Link to={LOGIN_PATH}>
                            {t('auth.login.title')}
                        </Link>
                    </Flex>
                </div>
            </LayoutForm>
        </>
    );
};

export default ForgotPassword;
