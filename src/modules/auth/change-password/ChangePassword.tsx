import { useTranslation } from 'react-i18next';
import classes from '../layout-form/layout-form.module.scss';
import Form, { useForm } from 'antd/es/form/Form';
import LayoutForm from '../layout-form/LayoutForm';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';

const ChangePassword = () => {
    const { t } = useTranslation('translation');
    const [form] = useForm();

    return (
        <>
            <LayoutForm>
                <div className={classes.layoutContainer}>
                    <div className={classes.title}>{t('auth.change_password.title')}</div>
                    <div>
                        <Form form={form} className={classes.form}>
                            <FormItem className={classes.formItem}>
                                <Input
                                    className={classes.formInput}
                                    placeholder={t('auth.change_password.username')}
                                />
                            </FormItem>
                            <FormItem className={classes.formItem}>
                                <Input.Password
                                    className={`${classes.formInput} ${classes.formPassword}`}
                                    placeholder={t('auth.change_password.new_password')}
                                />
                            </FormItem>
                            <FormItem className={classes.formItem}>
                                <Input.Password
                                    className={`${classes.formInput} ${classes.formPassword}`}
                                    placeholder={t('auth.change_password.confirm_new_password')}
                                />
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button className={classes.btnSubmit}>
                            {t('app.confirm')}
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

export default ChangePassword;
