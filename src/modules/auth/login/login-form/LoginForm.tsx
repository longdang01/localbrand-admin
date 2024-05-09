import classes from '../../layout-form/layout-form.module.scss';
import Form, { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FORGOT_PASSWORD_PATH, HOME_PATH } from '@/paths';
import LayoutForm from '../../layout-form/LayoutForm';
import { useLogin } from '@/loaders/auth.loader';
import storage from '@/utils/storage';
import { RULES_FORM } from '@/utils/validator';

interface Props {
    logoRender?: React.ReactNode;
}

const LoginForm = ({}: Props) => {
    const { t } = useTranslation('translation');
    const [form] = useForm();
    const navigate = useNavigate();

    const login = useLogin({
        config: {
            onSuccess: (response) => {
                // save to localStorage
                storage.setStorage('user', JSON.stringify(response?.detail));

                // notifications
                notification.success({
                    message: t('messages.login_success'),
                    description: (
                        <Flex
                            gap={8}
                            justify='space-between'
                            align="flex-end"
                            style={{ marginTop: 16 }}
                        >
                            {t("messages.redirecting")} 
                            <div style={{ paddingRight: "20px" }}>
                                <div className="dot-loader"></div>
                            </div>
                        </Flex>
                    ),
                    duration: .3,
                });

                // navigate
                setTimeout(() => {
                    navigate(HOME_PATH);
                }, 300)
            },
            onError: (error) => {
                notification.error({
                    message: t('messages.login_failure') || error.message,
                });
            },
        },
    });

    const handleSubmit = async () => {
        const values = await form.validateFields();
        login.mutate(values);
    };

    return (
        <>
            <LayoutForm>
                <div className={classes.layoutContainer}>
                    <div className={classes.title}>{t('auth.login.title')}</div>
                    <div>
                        <Form form={form} className={classes.form}>
                            <FormItem
                                className={classes.formItem}
                                name={'username'}
                                rules={[...RULES_FORM.required, ...RULES_FORM.username]}
                            >
                                <Input
                                    className={classes.formInput}
                                    placeholder={t('auth.login.username')}
                                    onPressEnter={handleSubmit}
                                />
                            </FormItem>
                            <FormItem
                                className={classes.formItem}
                                name={'password'}
                                rules={[...RULES_FORM.required, ...RULES_FORM.password]}
                            >
                                <Input.Password
                                    className={`${classes.formInput} ${classes.formPassword}`}
                                    placeholder={t('auth.login.password')}
                                    onPressEnter={handleSubmit}
                                />
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button
                            className={classes.btnSubmit}
                            onClick={handleSubmit}
                            loading={login?.isLoading}
                        >
                            {t('auth.login.title')}
                        </Button>
                    </div>
                    <Flex
                        className={classes.footerContainer}
                        justify="center"
                        align="center"
                    >
                        <Typography.Text>
                            {t('auth.forget_password.title')}?
                        </Typography.Text>
                        <Link to={FORGOT_PASSWORD_PATH}>
                            {t('app.click_here')}
                        </Link>
                    </Flex>
                </div>
            </LayoutForm>
        </>
    );
};

export default LoginForm;
