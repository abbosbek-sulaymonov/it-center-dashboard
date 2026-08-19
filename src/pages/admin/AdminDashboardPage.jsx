import {
  BookOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Card, Col, List, Progress, Row, Tag, Typography } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { statsApi } from '@/api/stats.api.js';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { StatCard } from '@/components/common/StatCard.jsx';
import { ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useAuth } from '@/hooks/useAuth.js';

const { Text } = Typography;

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const fetchStats = useCallback(() => statsApi.adminOverview(), []);
  const { data, loading, error, refetch } = useApiResource(fetchStats);

  if (loading) return <LoadingScreen minHeight="50vh" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const totals = data?.totals ?? {};
  const byStatus = data?.enrollmentsByStatus ?? {};
  const popular = data?.popularCourses ?? [];
  const mostPopularCount = popular[0]?.total || 1;

  return (
    <div>
      <PageHeader
        title={t('dashboard.overview')}
        subtitle={t('dashboard.welcome', { name: user.fullName })}
      />

      <Row gutter={[16, 16]}>
        <Col xs={12} lg={8} xl={4}>
          <StatCard title={t('dashboard.totalStudents')} value={totals.students} prefix={<TeamOutlined />} />
        </Col>
        <Col xs={12} lg={8} xl={5}>
          <StatCard title={t('dashboard.totalTutors')} value={totals.tutors} prefix={<SolutionOutlined />} />
        </Col>
        <Col xs={12} lg={8} xl={5}>
          <StatCard title={t('dashboard.totalCourses')} value={totals.courses} prefix={<ReadOutlined />} />
        </Col>
        <Col xs={12} lg={12} xl={5}>
          <StatCard title={t('dashboard.totalBooks')} value={totals.books} prefix={<BookOutlined />} />
        </Col>
        <Col xs={24} lg={12} xl={5}>
          <StatCard
            title={t('dashboard.totalEnrollments')}
            value={totals.enrollments}
            prefix={<TrophyOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card title={t('dashboard.popularCourses')}>
            {popular.length ? (
              <List
                dataSource={popular}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <Progress
                          percent={Math.round((item.total / mostPopularCount) * 100)}
                          format={() => `${item.total}`}
                          size="small"
                        />
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <EmptyState description={t('enrollment.empty')} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title={t('dashboard.enrollmentsByStatus')}>
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
        </Col>
      </Row>
    </div>
  );
}
