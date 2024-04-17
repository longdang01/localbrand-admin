import { ConfigProvider } from 'antd';
import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import routers from './routes';
import './locales/i18n';
import { useColorState } from './stores/color.store';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

const App = () => {
    const { themeColor } = useColorState(); // Get the themeColor state from useColorState

    i18next.init();

    const storedLocale = localStorage.getItem('locale');
    if(!storedLocale) localStorage.setItem("locale", "en");

    const initialLocale = storedLocale || 'en';
    i18next.changeLanguage(initialLocale);
    
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18next}>
                    <ConfigProvider theme={themeColor}
                    locale={initialLocale === 'vi' ? viVN : enUS}
                    
                    >
                        <RouterProvider router={routers} />
                    </ConfigProvider>
                </I18nextProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

if (import.meta.hot) {
    import.meta.hot.accept(['./locales/i18n'], () => {});
}
