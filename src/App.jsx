import { App as AntApp, ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import uzUZ from 'antd/locale/uz_UZ';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext.jsx';
import { AppRoutes } from '@/routes/AppRoutes.jsx';

const ANTD_LOCALES = { uz: uzUZ, en: enUS };

const THEME = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1d4ed8',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

export default function App() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? 'uz';

  return (
    <ConfigProvider theme={THEME} locale={ANTD_LOCALES[language] ?? uzUZ}>
      {/* AntApp supplies the message/modal/notification context the pages use. */}
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
