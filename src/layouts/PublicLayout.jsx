import { Button, Flex, Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '@/assets/logo.svg';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher.jsx';
import { PATHS, dashboardPathFor } from '@/constants/routes.js';
import { useAuth } from '@/hooks/useAuth.js';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export function PublicLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const items = [
    { key: PATHS.home, label: <Link to={PATHS.home}>{t('nav.home')}</Link> },
    { key: PATHS.courses, label: <Link to={PATHS.courses}>{t('nav.courses')}</Link> },
    { key: PATHS.library, label: <Link to={PATHS.library}>{t('nav.library')}</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="public-header">
        <Link to={PATHS.home} className="brand">
          <img src={logo} alt="" width={32} height={32} />
          <span>{t('common.appName')}</span>
        </Link>

        <Menu mode="horizontal" items={items} selectedKeys={[pathname]} className="public-nav" />

        <Flex align="center" gap={8}>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button type="primary" onClick={() => navigate(dashboardPathFor(user.role))}>
              {t('nav.dashboard')}
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate(PATHS.login)}>{t('nav.login')}</Button>
              <Button type="primary" onClick={() => navigate(PATHS.signup)}>
                {t('nav.signup')}
              </Button>
            </>
          )}
        </Flex>
      </Header>

      <Content className="public-content">
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Text type="secondary">
          {t('common.appName')} · {t('common.tagline')}
        </Text>
      </Footer>
    </Layout>
  );
}
