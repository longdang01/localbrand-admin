import { createBrowserRouter } from 'react-router-dom';
import { HOME_PATH } from './paths';
import AppLayout from './modules/app/views/AppLayout';
import Home from './modules/home/views/Home';
import ErrorBoundary from './modules/errors/ErrorBoundary';

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
        ],
    },
]);

export default routers;
