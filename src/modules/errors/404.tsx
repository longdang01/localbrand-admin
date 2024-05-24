import { DASHBOARD_PATH } from '@/paths';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../shared/page-header/Pageheader';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('translation');

    const backHome = () => {
        navigate(DASHBOARD_PATH);
    };

    useEffect(() => {
        document.title = 'Không tìm thấy trang | FRAGILE CLUB';
    }, []);

    return (
        <>
            <PageHeader isContainTitle={false} />
            <Result
                status="404"
                title={t('errors.404.title')}
                subTitle={t('errors.404.sub_title')}
                
                extra={
                    <Button type="primary" onClick={backHome}>
                        {t('errors.404.btn_back')}
                    </Button>
                }
            />
        </>
    );
};
