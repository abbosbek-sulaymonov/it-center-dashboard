import { ArrowRightOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Flex, Row, Typography } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { bookApi } from '@/api/book.api.js';
import { courseApi } from '@/api/course.api.js';
import { tutorApi } from '@/api/tutor.api.js';
import { BookCard } from '@/components/book/BookCard.jsx';
import { CourseCard } from '@/components/course/CourseCard.jsx';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { StatCard } from '@/components/common/StatCard.jsx';
import { PATHS } from '@/constants/routes.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { initialsOf } from '@/utils/format.js';

const { Title, Paragraph, Text } = Typography;

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchCourses = useCallback(() => courseApi.list({ limit: 6 }), []);
  const fetchBooks = useCallback(() => bookApi.list({ limit: 4 }), []);
  const fetchTutors = useCallback(() => tutorApi.list({ limit: 4 }), []);

  const courses = useApiResource(fetchCourses);
  const books = useApiResource(fetchBooks);
  const tutors = useApiResource(fetchTutors);

  if (courses.loading && books.loading && tutors.loading) return <LoadingScreen />;

  return (
    <div className="landing">
      <section className="hero">
        <Title style={{ marginBottom: 12 }}>{t('landing.heroTitle')}</Title>
        <Paragraph className="hero-text">{t('landing.heroText')}</Paragraph>
        <Flex gap={12} wrap justify="center">
          <Button type="primary" size="large" onClick={() => navigate(PATHS.courses)}>
            {t('landing.browseCourses')}
          </Button>
          <Button size="large" onClick={() => navigate(PATHS.library)}>
            {t('landing.browseLibrary')}
          </Button>
        </Flex>
      </section>

      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        <Col xs={24} sm={8}>
          <StatCard title={t('landing.statsCourses')} value={courses.meta?.total ?? 0} />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title={t('landing.statsTutors')} value={tutors.meta?.total ?? 0} />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title={t('landing.statsBooks')} value={books.meta?.total ?? 0} />
        </Col>
      </Row>

      <SectionHeader title={t('landing.featuredCourses')} onViewAll={() => navigate(PATHS.courses)} />
      {courses.data?.length ? (
        <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
          {courses.data.map((course) => (
            <Col key={course._id} xs={24} sm={12} lg={8}>
              <CourseCard course={course} onClick={() => navigate(PATHS.courseDetail(course._id))} />
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyState description={t('course.empty')} />
      )}

      <SectionHeader title={t('landing.meetTutors')} />
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {tutors.data?.map((tutor) => (
          <Col key={tutor._id} xs={24} sm={12} lg={6}>
            <Card style={{ height: '100%' }}>
              <Flex vertical align="center" gap={8} style={{ textAlign: 'center' }}>
                <Avatar size={64} src={tutor.user?.avatarUrl || null}>
                  {initialsOf(tutor.user?.fullName ?? '')}
                </Avatar>
                <Text strong>{tutor.user?.fullName}</Text>
                <Text type="secondary">{tutor.specialization}</Text>
                {tutor.experienceYears ? (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('tutor.experienceYears', { count: tutor.experienceYears })}
                  </Text>
                ) : null}
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>

      <SectionHeader title={t('landing.featuredBooks')} onViewAll={() => navigate(PATHS.library)} />
      <Row gutter={[16, 16]}>
        {books.data?.map((book) => (
          <Col key={book._id} xs={24} sm={12} lg={6}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

function SectionHeader({ title, onViewAll }) {
  const { t } = useTranslation();

  return (
    <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>
      {onViewAll ? (
        <Button type="link" onClick={onViewAll}>
          {t('landing.viewAll')} <ArrowRightOutlined />
        </Button>
      ) : null}
    </Flex>
  );
}
