import { Col, Flex, Pagination, Row, Select } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { courseApi } from '@/api/course.api.js';
import { CourseCard } from '@/components/course/CourseCard.jsx';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { COURSE_LEVELS } from '@/constants/roles.js';
import { PATHS } from '@/constants/routes.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';

export default function CourseCatalogPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const query = useTableQuery({ limit: 9, level: undefined, category: undefined });

  const fetchCourses = useCallback(() => courseApi.list(query.params), [query.params]);
  const fetchCategories = useCallback(() => courseApi.categories(), []);

  const { data, meta, loading, error, refetch } = useApiResource(fetchCourses);
  const categories = useApiResource(fetchCategories);

  return (
    <div className="page-container">
      <PageHeader
        title={t('nav.courses')}
        subtitle={t('landing.heroText')}
        extra={[
          <SearchInput key="search" value={query.search} onChange={query.applySearch} />,
          <Select
            key="level"
            allowClear
            style={{ minWidth: 160 }}
            placeholder={t('course.level')}
            value={query.filters.level}
            onChange={(value) => query.applyFilter('level', value)}
            options={COURSE_LEVELS.map((level) => ({ value: level, label: t(`course.levels.${level}`) }))}
          />,
          <Select
            key="category"
            allowClear
            style={{ minWidth: 160 }}
            placeholder={t('course.category')}
            value={query.filters.category}
            onChange={(value) => query.applyFilter('category', value)}
            options={(categories.data ?? []).map((category) => ({ value: category, label: category }))}
          />,
        ]}
      />

      {error ? <ErrorState error={error} onRetry={refetch} /> : null}
      {loading ? <LoadingScreen minHeight="40vh" /> : null}

      {!loading && !error ? (
        data?.length ? (
          <>
            <Row gutter={[16, 16]}>
              {data.map((course) => (
                <Col key={course._id} xs={24} sm={12} lg={8}>
                  <CourseCard course={course} onClick={() => navigate(PATHS.courseDetail(course._id))} />
                </Col>
              ))}
            </Row>
            <Flex justify="center" style={{ marginTop: 32 }}>
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
