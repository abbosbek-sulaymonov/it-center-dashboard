import { App as AntApp, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher.jsx';
import { PATHS, dashboardPathFor } from '@/constants/routes.js';
import { useAuth } from '@/hooks/useAuth.js';
import { readableError } from '@/utils/format.js';

const { Title, Text, Paragraph } = Typography;

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { signup, user, initializing } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (!initializing && user) return <Navigate to={dashboardPathFor(user.role)} replace />;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const created = await signup(values);
      message.success(t('auth.signupSuccess'));
      navigate(dashboardPathFor(created.role), { replace: true });
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
          {t('auth.signupTitle')}
        </Title>
        <Paragraph type="secondary">{t('auth.signupSubtitle')}</Paragraph>

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="fullName"
            label={t('auth.fullName')}
            rules={[{ required: true, message: t('auth.validation.fullNameRequired') }]}
          >
            <Input size="large" autoComplete="name" />
          </Form.Item>

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
            rules={[
              { required: true, message: t('auth.validation.passwordRequired') },
              { min: 8, message: t('auth.validation.passwordMin') },
            ]}
          >
            <Input.Password size="large" autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="phone" label={`${t('auth.phone')} (${t('common.optional')})`}>
            <Input size="large" autoComplete="tel" />
          </Form.Item>

          <Button type="primary" size="large" block htmlType="submit" loading={submitting}>
            {t('auth.submitSignup')}
          </Button>
        </Form>

        <Flex justify="center" gap={6} style={{ marginTop: 16 }}>
          <Text type="secondary">{t('auth.haveAccount')}</Text>
          <Link to={PATHS.login}>{t('nav.login')}</Link>
        </Flex>
      </Card>
    </div>
  );
}
