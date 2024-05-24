import { createBrowserRouter } from 'react-router-dom';
import {
    BRAND_PATH,
    CATEGORY_BIG_PATH,
    CATEGORY_SMALL_PATH,
    COLLECTION_PATH,
    CUSTOMER_PATH,
    DASHBOARD_PATH,
    FORGOT_PASSWORD_PATH,
    IMPORT_BILL_CREATE_PATH,
    IMPORT_BILL_EDIT_PATH,
    IMPORT_BILL_PATH,
    LOGIN_PATH,
    LOOKBOOK_PATH,
    NOT_AUTHORIZATION_PATH,
    NOT_FOUND_PATH,
    ORDER_CREATE_PATH,
    ORDER_EDIT_PATH,
    ORDER_PATH,
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
import {
    ProductDetailPage,
    ProductPage,
} from './modules/import-management/product';
import { SupplierPage } from './modules/import-management/supplier';
import { SlidePage } from './modules/media-management/slide';
import { LookbookPage } from './modules/media-management/lookbook';
import { StaffPage } from './modules/system-management/staff';
import {
    ImportBillCreatePage,
    ImportBillEditPage,
    ImportBillPage,
} from './modules/import-management/import-bill';
import { CustomerPage } from './modules/sell-management/customer';
import {
    OrderCreatePage,
    OrderEditPage,
    OrderPage,
} from './modules/sell-management/order';
import RoleGuard from './guard/RoleGuard';

const routers = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: DASHBOARD_PATH,
                element: <DashboardPage />,
            },
            {
                path: BRAND_PATH,
                element: <RoleGuard roles={[1, 2]} children={<BrandPage />} />,
            },
            {
                path: CATEGORY_BIG_PATH,
                element: (
                    <RoleGuard roles={[1, 2]} children={<CategoryBigPage />} />
                ),
            },
            {
                path: CATEGORY_SMALL_PATH,
                element: (
                    <RoleGuard
                        roles={[1, 2]}
                        children={<CategorySmallPage />}
                    />
                ),
            },
            {
                path: COLLECTION_PATH,
                element: (
                    <RoleGuard children={<CollectionPage />} roles={[1, 2]} />
                ),
            },
            {
                path: IMPORT_BILL_PATH,
                element: (
                    <RoleGuard children={<ImportBillPage />} roles={[1, 2]} />
                ),
            },
            {
                path: IMPORT_BILL_CREATE_PATH,
                element: (
                    <RoleGuard
                        children={<ImportBillCreatePage />}
                        roles={[1, 2]}
                    />
                ),
            },
            {
                path: IMPORT_BILL_EDIT_PATH,
                element: (
                    <RoleGuard
                        children={<ImportBillEditPage />}
                        roles={[1, 2]}
                    />
                ),
            },
            {
                path: PRODUCT_PATH,
                element: (
                    <RoleGuard children={<ProductPage />} roles={[1, 2]} />
                ),
            },
            {
                path: PRODUCT_DETAIL_PATH,
                element: (
                    <RoleGuard
                        children={<ProductDetailPage />}
                        roles={[1, 2]}
                    />
                ),
            },
            {
                path: SUPPLIER_PATH,
                element: (
                    <RoleGuard children={<SupplierPage />} roles={[1, 2]} />
                ),
            },
            {
                path: ORDER_PATH,
                element: <RoleGuard children={<OrderPage />} roles={[1, 3]} />,
            },
            {
                path: ORDER_CREATE_PATH,
                element: (
                    <RoleGuard children={<OrderCreatePage />} roles={[1, 3]} />
                ),
            },
            {
                path: ORDER_EDIT_PATH,
                element: (
                    <RoleGuard children={<OrderEditPage />} roles={[1, 3]} />
                ),
            },
            {
                path: CUSTOMER_PATH,
                element: (
                    <RoleGuard children={<CustomerPage />} roles={[1, 3]} />
                ),
            },
            {
                path: STAFF_PATH,
                element: <RoleGuard children={<StaffPage />} roles={[1]} />,
            },

            {
                path: SLIDE_PATH,
                element: <RoleGuard children={<SlidePage />} roles={[1, 4]} />,
            },
            {
                path: LOOKBOOK_PATH,
                element: (
                    <RoleGuard children={<LookbookPage />} roles={[1, 4]} />
                ),
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
