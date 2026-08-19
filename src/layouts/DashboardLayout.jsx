import {
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App as AntApp, Avatar, Button, Dropdown, Flex, Layout, Menu, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher.jsx';
import { PATHS } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';
import { useAuth } from '@/hooks/useAuth.js';
import { initialsOf } from '@/utils/format.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/** Sidebar entries per role, in display order. */
function menuItemsFor(role, t) {
  if (role === ROLES.ADMIN) {
    return [
      { key: PATHS.admin.dashboard, icon: <DashboardOutlined />, label: t('nav.dashboard') },
      { key: PATHS.admin.courses, icon: <ReadOutlined />, label: t('nav.courses') },
      { key: PATHS.admin.books, icon: <BookOutlined />, label: t('nav.books') },
      { key: PATHS.admin.tutors, icon: <SolutionOutlined />, label: t('nav.tutors') },
      { key: PATHS.admin.students, icon: <TeamOutlined />, label: t('nav.students') },
      { key: PATHS.admin.enrollments, icon: <UserOutlined />, label: t('nav.enrollments') },
    ];
  }

  if (role === ROLES.TUTOR) {
    return [
      { key: PATHS.tutor.dashboard, icon: <DashboardOutlined />, label: t('nav.dashboard') },
      { key: PATHS.tutor.courses, icon: <ReadOutlined />, label: t('nav.myCourses') },
      { key: PATHS.tutor.students, icon: <TeamOutlined />, label: t('nav.myStudents') },
    ];
  }

  return [
    { key: PATHS.student.dashboard, icon: <DashboardOutlined />, label: t('nav.dashboard') },
    { key: PATHS.student.courses, icon: <ReadOutlined />, label: t('nav.myCourses') },
    { key: PATHS.student.library, icon: <BookOutlined />, label: t('nav.library') },
  ];
}

export function DashboardLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    message.success(t('auth.logoutSuccess'));
    navigate(PATHS.login);
  };

  const userMenu = [
    { key: 'home', icon: <UserOutlined />, label: <Link to={PATHS.home}>{t('nav.home')}</Link> },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: t('nav.logout'), danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} trigger={null} breakpoint="lg" onBreakpoint={setCollapsed}>
        <Link to={PATHS.home} className="sider-brand">
          {collapsed ? 'IT' : t('common.appName')}
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItemsFor(user.role, t)}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="dashboard-header">
          <Button
            type="text"
            aria-label="toggle navigation"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          />

          <Flex align="center" gap={12}>
            <LanguageSwitcher />
            <Dropdown
              trigger={['click']}
              menu={{ items: userMenu, onClick: ({ key }) => key === 'logout' && handleLogout() }}
            >
              <Flex align="center" gap={8} style={{ cursor: 'pointer' }}>
                <Avatar src={user.avatarUrl || null}>{initialsOf(user.fullName)}</Avatar>
                <Text className="dashboard-username">{user.fullName}</Text>
              </Flex>
            </Dropdown>
          </Flex>
        </Header>

        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
