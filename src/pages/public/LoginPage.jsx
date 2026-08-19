import { App as AntApp, Alert, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher.jsx';
import { PATHS, dashboardPathFor } from '@/constants/routes.js';
import { useAuth } from '@/hooks/useAuth.js';
import { readableError } from '@/utils/format.js';

const { Title, Text, Paragraph } = Typography;

const DEMO_ACCOUNTS = [
  { role: 'admin', email: 'admin@itcenter.uz' },
  { role: 'tutor', email: 'dilnoza@itcenter.uz' },
  { role: 'student', email: 'aziz@example.com' },
];
const DEMO_PASSWORD = 'Password123';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  const { login, user, initializing } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Already signed in — skip the form entirely.
  if (!initializing && user) return <Navigate to={dashboardPathFor(user.role)} replace />;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const signedIn = await login(values);
      message.success(t('auth.loginSuccess'));
      // Return to whatever the guard interrupted, otherwise the role dashboard.
      navigate(location.state?.from?.pathname ?? dashboardPathFor(signedIn.role), { replace: true });
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Flex justify="flex-end">
          <LanguageSwitcher />
        </Flex>

        <Title level={3} style={{ marginBottom: 4 }}>
          {t('auth.loginTitle')}
        </Title>
        <Paragraph type="secondary">{t('auth.loginSubtitle')}</Paragraph>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="email"
            label={t('auth.email')}
            rules={[
              { required: true, message: t('auth.validation.emailRequired') },
              { type: 'email', message: t('auth.validation.emailInvalid') },
            ]}
          >
            <Input size="large" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.validation.passwordRequired') }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" size="large" block htmlType="submit" loading={submitting}>
            {t('auth.submitLogin')}
          </Button>
        </Form>

        <Flex justify="center" gap={6} style={{ marginTop: 16 }}>
          <Text type="secondary">{t('auth.noAccount')}</Text>
          <Link to={PATHS.signup}>{t('nav.signup')}</Link>
        </Flex>

        <Alert
          type="info"
          showIcon
          style={{ marginTop: 24 }}
          message={t('auth.demoTitle')}
          description={
            <Flex vertical gap={4}>
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.email}
                  size="small"
                  type="link"
                  style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                  onClick={() => form.setFieldsValue({ email: account.email, password: DEMO_PASSWORD })}
                >
                  {account.role} — {account.email}
                </Button>
              ))}
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('auth.demoHint', { password: DEMO_PASSWORD })}
              </Text>
            </Flex>
          }
        />
      </Card>
    </div>
  );
}
