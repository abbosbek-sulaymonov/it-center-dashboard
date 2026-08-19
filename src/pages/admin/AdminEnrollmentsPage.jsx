import { EditOutlined, StopOutlined } from '@ant-design/icons';
import {
  App as AntApp,
  Button,
  Flex,
  Pagination,
  Popconfirm,
  Progress,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { enrollmentApi } from '@/api/enrollment.api.js';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { EnrollmentFormModal } from '@/components/people/EnrollmentFormModal.jsx';
import { ENROLLMENT_STATUS, ENROLLMENT_STATUS_COLOR } from '@/constants/roles.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { formatDate, readableError } from '@/utils/format.js';

export default function AdminEnrollmentsPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 10, status: undefined });

  const fetchEnrollments = useCallback(() => enrollmentApi.list(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchEnrollments);

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

  const handleCancel = async (enrollment) => {
    try {
      await enrollmentApi.cancel(enrollment._id);
      message.success(t('enrollment.cancelled'));
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  const columns = [
    { title: t('enrollment.student'), dataIndex: ['student', 'user', 'fullName'], ellipsis: true },
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
      title: t('enrollment.enrolledAt'),
      dataIndex: 'enrolledAt',
      render: formatDate,
      responsive: ['lg'],
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 110,
      render: (_, enrollment) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(enrollment)} />
          <Popconfirm
            title={t('common.confirmDelete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => handleCancel(enrollment)}
          >
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              disabled={enrollment.status === ENROLLMENT_STATUS.CANCELLED}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.enrollments')}
        extra={[
          <Select
            key="status"
            allowClear
            style={{ minWidth: 180 }}
            placeholder={t('common.status')}
            value={query.filters.status}
            onChange={(value) => query.applyFilter('status', value)}
            options={Object.values(ENROLLMENT_STATUS).map((status) => ({
              value: status,
              label: t(`enrollment.status.${status}`),
            }))}
          />,
        ]}
      />

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data ?? []}
        pagination={false}
        scroll={{ x: 760 }}
      />

      <Flex justify="flex-end" style={{ marginTop: 16 }}>
        <Pagination
          current={meta?.page ?? 1}
          pageSize={meta?.limit ?? 10}
          total={meta?.total ?? 0}
          showSizeChanger={false}
          onChange={query.setPage}
        />
      </Flex>

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
