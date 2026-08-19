import { ClockCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { CoverImage } from '@/components/common/CoverImage.jsx';
import { COURSE_LEVEL_COLOR } from '@/constants/roles.js';
import { formatPrice } from '@/utils/format.js';

const { Paragraph, Text } = Typography;

export function CourseCard({ course, actions, onClick, footer }) {
  const { t } = useTranslation();
  const tutorName = course.tutor?.user?.fullName;

  return (
    <Card
      hoverable={Boolean(onClick)}
      onClick={onClick}
      cover={<CoverImage src={course.imageUrl} alt={course.title} />}
      actions={actions}
      styles={{ body: { display: 'flex', flexDirection: 'column', gap: 8 } }}
      style={{ height: '100%' }}
    >
      <Flex gap={8} wrap>
        <Tag color={COURSE_LEVEL_COLOR[course.level]}>{t(`course.levels.${course.level}`)}</Tag>
        {course.category ? <Tag>{course.category}</Tag> : null}
      </Flex>

      <Text strong style={{ fontSize: 16 }}>
        {course.title}
      </Text>

      <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
        {course.description}
      </Paragraph>

      <Space size="middle" wrap style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        <span>
          <UserOutlined /> {tutorName ?? t('course.noTutor')}
        </span>
        <span>
          <ClockCircleOutlined /> {t('course.durationWeeks', { count: course.durationWeeks })}
        </span>
        {course.enrollmentCount !== undefined ? (
          <span>
            <TeamOutlined /> {course.enrollmentCount}/{course.capacity}
          </span>
        ) : null}
      </Space>

      <Flex align="center" justify="space-between" gap={8} style={{ marginTop: 'auto', paddingTop: 8 }}>
        <Text strong style={{ fontSize: 15 }}>
          {course.price > 0 ? formatPrice(course.price, t('common.currency')) : t('common.free')}
        </Text>
        {footer}
      </Flex>
    </Card>
  );
}

/** Convenience button used by catalogue screens. */
export function EnrollButton({ enrolled, loading, onEnroll }) {
  const { t } = useTranslation();

  return (
    <Button type="primary" disabled={enrolled} loading={loading} onClick={onEnroll}>
      {enrolled ? t('course.enrolled') : t('course.enroll')}
    </Button>
  );
}
