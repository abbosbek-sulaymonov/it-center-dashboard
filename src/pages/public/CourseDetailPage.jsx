import { ArrowLeftOutlined, ClockCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Col, Descriptions, Flex, Row, Tag, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { courseApi } from '@/api/course.api.js';
import { enrollmentApi } from '@/api/enrollment.api.js';
import { studentApi } from '@/api/student.api.js';
import { CoverImage } from '@/components/common/CoverImage.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { COURSE_LEVEL_COLOR, ENROLLMENT_STATUS } from '@/constants/roles.js';
import { PATHS } from '@/constants/routes.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useAuth } from '@/hooks/useAuth.js';
import { formatPrice, readableError } from '@/utils/format.js';

const { Title, Paragraph } = Typography;

export default function CourseDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { isAuthenticated, isStudent } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [justEnrolled, setJustEnrolled] = useState(false);

  const fetchCourse = useCallback(() => courseApi.detail(id), [id]);
  const { data: course, loading, error, refetch } = useApiResource(fetchCourse);

  // Signed-in students need to know whether they already hold a place here, so
  // a revisit shows "Enrolled" instead of a button that can only 409.
  const fetchEnrollments = useCallback(
    () => (isStudent ? studentApi.myEnrollments({ limit: 100 }) : Promise.resolve({ data: [] })),
    [isStudent],
  );
  const { data: enrollments } = useApiResource(fetchEnrollments);

  const alreadyEnrolled =
    justEnrolled ||
    (enrollments ?? []).some(
      (enrollment) => enrollment.course?._id === id && enrollment.status !== ENROLLMENT_STATUS.CANCELLED,
    );

  const handleEnroll = async () => {
    // Visitors have to sign in first; they come back here afterwards.
    if (!isAuthenticated) {
      navigate(PATHS.login, { state: { from: { pathname: PATHS.courseDetail(id) } } });
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentApi.create({ course: id });
      setJustEnrolled(true);
      message.success(t('course.enrollSuccess'));
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!course) return null;

  return (
    <div className="page-container">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(PATHS.courses)}
        style={{ paddingLeft: 0 }}
      >
        {t('common.back')}
      </Button>

      <Row gutter={[24, 24]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={15}>
          <Card cover={<CoverImage src={course.imageUrl} alt={course.title} height={320} />}>
            <Flex gap={8} wrap style={{ marginBottom: 12 }}>
              <Tag color={COURSE_LEVEL_COLOR[course.level]}>{t(`course.levels.${course.level}`)}</Tag>
              {course.category ? <Tag>{course.category}</Tag> : null}
            </Flex>

            <Title level={2} style={{ marginTop: 0 }}>
              {course.title}
            </Title>

            <Title level={5}>{t('course.detailsTitle')}</Title>
            <Paragraph style={{ whiteSpace: 'pre-line' }}>{course.description}</Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card>
            <Title level={3} style={{ marginTop: 0 }}>
              {course.price > 0 ? formatPrice(course.price, t('common.currency')) : t('common.free')}
            </Title>

            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> {t('course.tutor')}
                  </>
                }
              >
                {course.tutor?.user?.fullName ?? t('course.noTutor')}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <ClockCircleOutlined /> {t('course.duration')}
                  </>
                }
              >
                {t('course.durationWeeks', { count: course.durationWeeks })}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <TeamOutlined /> {t('course.capacity')}
                  </>
                }
              >
                {course.capacity}
              </Descriptions.Item>
            </Descriptions>

            {/* Only students hold enrollments; staff see the course read-only. */}
            {!isAuthenticated || isStudent ? (
              <Button
                type="primary"
                size="large"
                block
                loading={enrolling}
                disabled={alreadyEnrolled}
                onClick={handleEnroll}
              >
                {alreadyEnrolled ? t('course.enrolled') : t('course.enroll')}
              </Button>
            ) : null}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
