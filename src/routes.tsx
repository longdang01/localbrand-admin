import { createBrowserRouter } from 'react-router-dom';
import {
    BRAND_PATH,
    CATEGORY_BIG_PATH,
    CATEGORY_SMALL_PATH,
    COLLECTION_PATH,
    DASHBOARD_PATH,
    DATA_CATALOG_PATH,
    DATA_STATISTICS_PATH,
    DATA_WAREHOUSE_PATH,
    FORGOT_PASSWORD_PATH,
    IMPORT_BILL_PATH,
    LOGIN_PATH,
    NOT_AUTHORIZATION_PATH,
    NOT_FOUND_PATH,
    PRODUCT_PATH,
    RESET_PASSWORD_PATH,
    SERVER_ERROR_PATH,
    SUPPLIER_PATH,
} from './paths';
import AppLayout from './modules/app/views/AppLayout';
import AuthLayout from './modules/auth/views/AuthLayout';
import Login from './modules/auth/login/Login';
import ForgotPassword from './modules/auth/forgot-password/ForgotPassword';
import { ErrorBoundary } from './modules/errors/ErrorBoundary';
import { NotFoundPage } from './modules/errors/404';
import { NotAuthorizationPage } from './modules/errors/403';
import { ServerErrorPage } from './modules/errors/500';
import ResetPassword from './modules/auth/reset-password/ResetPassword';
import { DataCatalogPage } from './modules/data-warehouse-management/catalog';
import { DataWarehousePage } from './modules/data-warehouse-management/warehouse';
import { DataStatisticsPage } from './modules/data-warehouse-management/statistics';
import { ProductPage } from './modules/import-management/product';
import { DashboardPage } from './modules/dashboard';
import { CategoryBigPage } from './modules/import-management/category-big';
import { CategorySmallPage } from './modules/import-management/category-small';
import { BrandPage } from './modules/import-management/brand';
import { CollectionPage } from './modules/import-management/collection';
import { ImportBillPage } from './modules/import-management/import-bill';
import { SupplierPage } from './modules/import-management/supplier';

const routers = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            // {
            //     path: HOME_PATH,
            //     element: <Home />,
            // },
            {
                path: DATA_CATALOG_PATH,
                element: <DataCatalogPage />,
            },
            {
                path: DATA_WAREHOUSE_PATH,
                element: <DataWarehousePage />,
            },
            {
                path: DATA_STATISTICS_PATH,
                element: <DataStatisticsPage />,
            },

            {
                path: DASHBOARD_PATH,
                element: <DashboardPage />
            },
            {
                path: BRAND_PATH,
                element: <BrandPage />,
            },
            {
                path: CATEGORY_BIG_PATH,
                element: <CategoryBigPage />,
            },
            {
                path: CATEGORY_SMALL_PATH,
                element: <CategorySmallPage />,
            },
            {
                path: COLLECTION_PATH,
                element: <CollectionPage />,
            },
            {
                path: IMPORT_BILL_PATH,
                element: <ImportBillPage />,
            },
            {
                path: PRODUCT_PATH,
                element: <ProductPage />,
            },
            {
                path: SUPPLIER_PATH,
                element: <SupplierPage />,
            },

            {
                path: NOT_FOUND_PATH,
                element: <NotFoundPage />,
            },
            {
                path: NOT_AUTHORIZATION_PATH,
                element: <NotAuthorizationPage />,
            },
            {
                path: SERVER_ERROR_PATH,
                element: <ServerErrorPage />,
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: LOGIN_PATH,
                element: <Login />,
            },
            {
                path: FORGOT_PASSWORD_PATH,
                element: <ForgotPassword />,
            },
            {
                path: RESET_PASSWORD_PATH,
                element: <ResetPassword />,
            },
        ],
    },
]);

export default routers;
