import Form, { useForm } from 'antd/es/form/Form';
import classes from '../layout-form/layout-form.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { Button, Flex, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import LayoutForm from '../layout-form/LayoutForm';
import { Link } from 'react-router-dom';
import { LOGIN_PATH } from '@/paths';

const ForgetPassword = () => {
    const { t } = useTranslation('translation');
    const [form] = useForm();

    return (
        <>
            <LayoutForm>
                <div className={classes.layoutContainer}>
                    <div className={classes.title}>
                        {t('auth.forget_password.title')}
                    </div>
                    <div>
                        <Form form={form} className={classes.form}>
                            <FormItem className={classes.formItem}>
                                <Input
                                    className={classes.formInput}
                                    placeholder={t('auth.forget_password.email')}
                                />
                            </FormItem>
                        </Form>
                    </div>
                    <div>
                        <Button className={classes.btnSubmit}>
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

export default ForgetPassword;
