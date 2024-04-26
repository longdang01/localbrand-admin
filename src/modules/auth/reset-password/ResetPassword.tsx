import Form, { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import LayoutForm from '../layout-form/LayoutForm';
import classes from '../layout-form/layout-form.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';
import { RULES_FORM } from '@/utils/validator';

const ResetPassword = () => {
    const { t } = useTranslation('translation');
    const [form] = useForm();

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
                                name={'new_password'}
                                dependencies={['password']}
                                rules={[
                                    ...RULES_FORM.required,
                                    ...RULES_FORM.password,
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue('password') !==
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        'messages.not_matching_password',
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
                                    placeholder={t('users.fields.password_new')}
                                ></Input.Password>
                            </FormItem>
                            <FormItem
                                className={classes.formItem}
                                name={'new_confirm_password'}
                                dependencies={['new_password']}
                                rules={[
                                    ...RULES_FORM.required,
                                    ...RULES_FORM.password,
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue(
                                                    'new_password',
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
                                ></Input.Password>
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button className={classes.btnSubmit}>
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
