import { ReadOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, List, Row, Tag, Typography } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { tutorApi } from '@/api/tutor.api.js';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { StatCard } from '@/components/common/StatCard.jsx';
import { ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useAuth } from '@/hooks/useAuth.js';

const { Text } = Typography;

export default function TutorDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const fetchStats = useCallback(() => tutorApi.myStats(), []);
  const { data, loading, error, refetch } = useApiResource(fetchStats);

  if (loading) return <LoadingScreen minHeight="50vh" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const totals = data?.totals ?? {};
  const byStatus = data?.enrollmentsByStatus ?? {};

  return (
    <div>
      <PageHeader
        title={t('dashboard.overview')}
        subtitle={t('dashboard.welcome', { name: user.fullName })}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatCard title={t('dashboard.myCourses')} value={totals.courses} prefix={<ReadOutlined />} />
        </Col>
        <Col xs={24} sm={12}>
          <StatCard title={t('dashboard.myStudents')} value={totals.students} prefix={<TeamOutlined />} />
        </Col>
      </Row>

      <Card title={t('dashboard.enrollmentsByStatus')} style={{ marginTop: 24 }}>
        <List
          dataSource={Object.keys(ENROLLMENT_STATUS_COLOR)}
          renderItem={(status) => (
            <List.Item>
              <Tag color={ENROLLMENT_STATUS_COLOR[status]}>{t(`enrollment.status.${status}`)}</Tag>
              <Text strong>{byStatus[status] ?? 0}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
