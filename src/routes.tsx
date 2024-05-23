import { createBrowserRouter } from 'react-router-dom';
import {
    BRAND_PATH,
    CATEGORY_BIG_PATH,
    CATEGORY_SMALL_PATH,
    COLLECTION_PATH,
    DASHBOARD_PATH,
    FORGOT_PASSWORD_PATH,
    IMPORT_BILL_CREATE_PATH,
    IMPORT_BILL_EDIT_PATH,
    IMPORT_BILL_PATH,
    LOGIN_PATH,
    LOOKBOOK_PATH,
    NOT_AUTHORIZATION_PATH,
    NOT_FOUND_PATH,
    PRODUCT_DETAIL_PATH,
    PRODUCT_PATH,
    RESET_PASSWORD_PATH,
    SERVER_ERROR_PATH,
    SLIDE_PATH,
    STAFF_PATH,
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
import { DashboardPage } from './modules/dashboard';
import { CategoryBigPage } from './modules/import-management/category-big';
import { BrandPage } from './modules/import-management/brand';
import { CategorySmallPage } from './modules/import-management/category-small';
import { CollectionPage } from './modules/import-management/collection';
import { ProductDetailPage, ProductPage } from './modules/import-management/product';
import { SupplierPage } from './modules/import-management/supplier';
import { SlidePage } from './modules/media-management/slide';
import { LookbookPage } from './modules/media-management/lookbook';
import { StaffPage } from './modules/system-management/staff';
import { ImportBillCreatePage, ImportBillEditPage, ImportBillPage } from './modules/import-management/import-bill';

const routers = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
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
                path: IMPORT_BILL_CREATE_PATH,
                element: <ImportBillCreatePage />,
            },
            {
                path: IMPORT_BILL_EDIT_PATH,
                element: <ImportBillEditPage />,
            },
            {
                path: PRODUCT_PATH,
                element: <ProductPage />,
            },
            {
                path: PRODUCT_DETAIL_PATH,
                element: <ProductDetailPage />,
            },
            {
                path: SUPPLIER_PATH,
                element: <SupplierPage />,
            },

            {
                path: STAFF_PATH,
                element: <StaffPage />,
            },

            {
                path: SLIDE_PATH,
                element: <SlidePage />,
            },
            {
                path: LOOKBOOK_PATH,
                element: <LookbookPage />,
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
