import { createBrowserRouter } from 'react-router-dom';
import {
    FORGET_PASSWORD_PATH,
    HOME_PATH,
    LOGIN_PATH,
    NOT_AUTHORIZATION_PATH,
    NOT_FOUND_PATH,
    RESET_PASSWORD_PATH,
    SERVER_ERROR_PATH,
} from './paths';
import AppLayout from './modules/app/views/AppLayout';
import Home from './modules/home/views/Home';
import AuthLayout from './modules/auth/views/AuthLayout';
import Login from './modules/auth/login/Login';
import ForgetPassword from './modules/auth/forget-password/ForgetPassword';
import { ErrorBoundary } from './modules/errors/ErrorBoundary';
import { NotFoundPage } from './modules/errors/404';
import { NotAuthorizationPage } from './modules/errors/403';
import { ServerErrorPage } from './modules/errors/500';
import ResetPassword from './modules/auth/reset-password/ResetPassword';

const routers = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: HOME_PATH,
                element: <Home />,
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
                path: FORGET_PASSWORD_PATH,
                element: <ForgetPassword />,
            },
            {
                path: RESET_PASSWORD_PATH,
                element: <ResetPassword />,
            },
        ],
    },
]);

export default routers;
