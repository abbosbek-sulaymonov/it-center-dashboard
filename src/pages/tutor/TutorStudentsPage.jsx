import { EditOutlined } from '@ant-design/icons';
import { App as AntApp, Avatar, Button, Progress, Space, Table, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { enrollmentApi } from '@/api/enrollment.api.js';
import { tutorApi } from '@/api/tutor.api.js';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { EnrollmentFormModal } from '@/components/people/EnrollmentFormModal.jsx';
import { ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { initialsOf, readableError } from '@/utils/format.js';

export default function TutorStudentsPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();

  const fetchStudents = useCallback(() => tutorApi.myStudents(), []);
  const { data, loading, error, refetch } = useApiResource(fetchStudents);

  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await enrollmentApi.update(editing._id, values);
      setEditing(null);
      message.success(t('enrollment.updated'));
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: t('enrollment.student'),
      key: 'student',
      render: (_, enrollment) => (
        <Space>
          <Avatar src={enrollment.student?.user?.avatarUrl || null}>
            {initialsOf(enrollment.student?.user?.fullName ?? '')}
          </Avatar>
          {enrollment.student?.user?.fullName}
        </Space>
      ),
    },
    { title: t('student.group'), dataIndex: ['student', 'group'], responsive: ['md'] },
    { title: t('enrollment.course'), dataIndex: ['course', 'title'], ellipsis: true, responsive: ['md'] },
    {
      title: t('common.status'),
      dataIndex: 'status',
      render: (status) => (
        <Tag color={ENROLLMENT_STATUS_COLOR[status]}>{t(`enrollment.status.${status}`)}</Tag>
      ),
    },
    {
      title: t('enrollment.progress'),
      dataIndex: 'progress',
      width: 160,
      render: (progress) => <Progress percent={progress} size="small" />,
      responsive: ['lg'],
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 80,
      render: (_, enrollment) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(enrollment)} />
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title={t('dashboard.myStudents')} />

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data ?? []}
        scroll={{ x: 720 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <EnrollmentFormModal
        open={Boolean(editing)}
        enrollment={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
