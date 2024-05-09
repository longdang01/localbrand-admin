import { createBrowserRouter } from 'react-router-dom';
import {
    DATA_CATALOG_PATH,
    DATA_STATISTICS_PATH,
    DATA_WAREHOUSE_PATH,
    FORGOT_PASSWORD_PATH,
    LOGIN_PATH,
    NOT_AUTHORIZATION_PATH,
    NOT_FOUND_PATH,
    RESET_PASSWORD_PATH,
    SERVER_ERROR_PATH,
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
