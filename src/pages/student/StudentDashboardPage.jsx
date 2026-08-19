import { BookOutlined, CheckCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Progress, Row, Tag, Typography } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { studentApi } from '@/api/student.api.js';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { StatCard } from '@/components/common/StatCard.jsx';
import { ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { PATHS } from '@/constants/routes.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useAuth } from '@/hooks/useAuth.js';

const { Text } = Typography;

export default function StudentDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchStats = useCallback(() => studentApi.myStats(), []);
  const fetchEnrollments = useCallback(() => studentApi.myEnrollments({ limit: 5 }), []);

  const stats = useApiResource(fetchStats);
  const enrollments = useApiResource(fetchEnrollments);

  if (stats.loading) return <LoadingScreen minHeight="50vh" />;
  if (stats.error) return <ErrorState error={stats.error} onRetry={stats.refetch} />;

  const totals = stats.data?.totals ?? {};

  return (
    <div>
      <PageHeader
        title={t('dashboard.overview')}
        subtitle={t('dashboard.welcome', { name: user.fullName })}
        extra={[
          <Button key="browse" type="primary" onClick={() => navigate(PATHS.courses)}>
            {t('dashboard.browseCatalogue')}
          </Button>,
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.enrolledCourses')}
            value={totals.enrolled}
            prefix={<ReadOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.completedCourses')}
            value={totals.completed}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title={t('dashboard.availableBooks')} value={totals.books} prefix={<BookOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.averageProgress')}
            value={stats.data?.averageProgress ?? 0}
            suffix="%"
          />
        </Col>
      </Row>

      <Card title={t('dashboard.continueLearning')} style={{ marginTop: 24 }}>
        {enrollments.data?.length ? (
          <List
            dataSource={enrollments.data}
            renderItem={(enrollment) => (
              <List.Item
                actions={[
                  <Tag key="status" color={ENROLLMENT_STATUS_COLOR[enrollment.status]}>
                    {t(`enrollment.status.${enrollment.status}`)}
                  </Tag>,
                ]}
              >
                <List.Item.Meta
                  title={enrollment.course?.title}
                  description={
                    <>
                      <Text type="secondary">
                        {enrollment.course?.tutor?.user?.fullName ?? t('course.noTutor')}
                      </Text>
                      <Progress percent={enrollment.progress} size="small" style={{ maxWidth: 320 }} />
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <EmptyState description={t('enrollment.empty')}>
            <Button type="primary" onClick={() => navigate(PATHS.courses)}>
              {t('dashboard.browseCatalogue')}
            </Button>
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
