import { useGetByPath } from '@/loaders/product.loader';
import PageHeader from '@/modules/shared/page-header/Pageheader';
import { getSlugify } from '@/utils/path';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProductColors from './components/detail/ProductColors';

const ProductDetail = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation('translation', {
        keyPrefix: 'import',
    });

    const PRODUCT_BREADCRUMBS = [
        {
            title: <span>{t('title')}</span>,
        },
    ];

    const getByPath = useGetByPath({
        params: {
            path: getSlugify(pathname)
        }
    })

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <meta charSet="UTF-8" />
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <meta name="theme-color" content="#000000" />
                    <title>
                        {t('product.meta_title') + ' / FRAGILE Việt Nam'}
                    </title>
                </Helmet>
            </HelmetProvider>

            <PageHeader
                pageBreadcrumbs={PRODUCT_BREADCRUMBS}
                title={
                    <>
                        {getByPath?.isLoading ? (
                            <div style={{ marginLeft: 20 }}>
                                <div className="dot-loader-sm"></div>
                            </div>
                        ) : (
                            getByPath?.data?.productName
                        )}
                    </>
                }
                isContainTitle={true}
            />

            <ProductColors product={getByPath?.data}/>


        </>
    );
};

export default ProductDetail;
