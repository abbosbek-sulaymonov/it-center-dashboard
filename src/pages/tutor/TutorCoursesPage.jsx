import { Col, Flex, Pagination, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { tutorApi } from '@/api/tutor.api.js';
import { CourseCard } from '@/components/course/CourseCard.jsx';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';

export default function TutorCoursesPage() {
  const { t } = useTranslation();
  const query = useTableQuery({ limit: 9 });

  const fetchCourses = useCallback(() => tutorApi.myCourses(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchCourses);

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title={t('dashboard.myCourses')} />

      {loading ? <LoadingScreen minHeight="40vh" /> : null}

      {!loading ? (
        data?.length ? (
          <>
            <Row gutter={[16, 16]}>
              {data.map((course) => (
                <Col key={course._id} xs={24} sm={12} xl={8}>
                  <CourseCard course={course} />
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
          <EmptyState description={t('course.empty')} />
        )
      ) : null}
    </div>
  );
}
