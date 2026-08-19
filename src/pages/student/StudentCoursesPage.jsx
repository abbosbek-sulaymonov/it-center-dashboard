import { App as AntApp, Button, Col, Flex, Pagination, Popconfirm, Progress, Row, Tag } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { enrollmentApi } from '@/api/enrollment.api.js';
import { studentApi } from '@/api/student.api.js';
import { CourseCard } from '@/components/course/CourseCard.jsx';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { ENROLLMENT_STATUS, ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { PATHS } from '@/constants/routes.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { readableError } from '@/utils/format.js';

export default function StudentCoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 9 });

  const fetchEnrollments = useCallback(() => studentApi.myEnrollments(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchEnrollments);

  const handleCancel = async (enrollment) => {
    try {
      await enrollmentApi.cancel(enrollment._id);
      message.success(t('enrollment.cancelled'));
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('dashboard.myCourses')}
        extra={[
          <Button key="browse" type="primary" onClick={() => navigate(PATHS.courses)}>
            {t('dashboard.browseCatalogue')}
          </Button>,
        ]}
      />

      {loading ? <LoadingScreen minHeight="40vh" /> : null}

      {!loading ? (
        data?.length ? (
          <>
            <Row gutter={[16, 16]}>
              {data.map((enrollment) => (
                <Col key={enrollment._id} xs={24} sm={12} xl={8}>
                  <CourseCard
                    course={enrollment.course}
                    onClick={() => navigate(PATHS.courseDetail(enrollment.course._id))}
                    footer={
                      <Tag color={ENROLLMENT_STATUS_COLOR[enrollment.status]}>
                        {t(`enrollment.status.${enrollment.status}`)}
                      </Tag>
                    }
                  />
                  <Flex align="center" gap={12} style={{ marginTop: 8 }}>
                    <Progress percent={enrollment.progress} size="small" style={{ flex: 1 }} />
                    {enrollment.status !== ENROLLMENT_STATUS.CANCELLED ? (
                      <Popconfirm
                        title={t('common.confirmDelete')}
                        okText={t('common.yes')}
                        cancelText={t('common.no')}
                        onConfirm={() => handleCancel(enrollment)}
                      >
                        <Button size="small" danger type="text">
                          {t('enrollment.cancel')}
                        </Button>
                      </Popconfirm>
                    ) : null}
                  </Flex>
                </Col>
              ))}
            </Row>
            <Flex justify="flex-end" style={{ marginTop: 24 }}>
              <Pagination
                current={meta?.page ?? 1}
                pageSize={meta?.limit ?? 9}
                total={meta?.total ?? 0}
                showSizeChanger={false}
                onChange={query.setPage}
              />
            </Flex>
          </>
        ) : (
          <EmptyState description={t('enrollment.empty')}>
            <Button type="primary" onClick={() => navigate(PATHS.courses)}>
              {t('dashboard.browseCatalogue')}
            </Button>
          </EmptyState>
        )
      ) : null}
    </div>
  );
}
