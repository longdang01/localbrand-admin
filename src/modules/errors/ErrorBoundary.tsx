import React from 'react';
import {
    Navigate,
    isRouteErrorResponse,
    useRouteError,
} from 'react-router-dom';
import { NOT_AUTHORIZATION_PATH, NOT_FOUND_PATH } from '@/paths';
import { HttpStatusCode } from 'axios';

export const ErrorBoundary: React.FC = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        switch (error?.status) {
            case HttpStatusCode.NotFound:
                return <Navigate to={NOT_FOUND_PATH} />;
            case HttpStatusCode.Unauthorized:
                return <Navigate to={NOT_AUTHORIZATION_PATH} />;
        }
    }
    return <Navigate to={NOT_FOUND_PATH} />;
};
