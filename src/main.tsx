import { ConfigProvider } from 'antd';
import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import viVN from 'antd/locale/vi_VN';
import routers from './routes';
import './locales/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConfigProvider locale={viVN}>
                <RouterProvider router={routers} />
            </ConfigProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);

if (import.meta.hot) {
    import.meta.hot.accept(['./locales/i18n'], () => {});
}
