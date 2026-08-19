import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Avatar, Button, Flex, Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { studentApi } from '@/api/student.api.js';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { StudentFormModal } from '@/components/people/StudentFormModal.jsx';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { formatDate, initialsOf, readableError } from '@/utils/format.js';

export default function AdminStudentsPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 10, includeInactive: 'true' });

  const fetchStudents = useCallback(() => studentApi.list(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchStudents);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) await studentApi.update(editing._id, values);
      else await studentApi.create(values);
      setModalOpen(false);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    try {
      await studentApi.remove(student._id);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  const columns = [
    {
      title: t('auth.fullName'),
      key: 'name',
      render: (_, student) => (
        <Space>
          <Avatar src={student.user?.avatarUrl || null}>{initialsOf(student.user?.fullName ?? '')}</Avatar>
          {student.user?.fullName}
        </Space>
      ),
    },
    { title: t('auth.email'), dataIndex: ['user', 'email'], responsive: ['md'] },
    { title: t('student.group'), dataIndex: 'group', responsive: ['md'] },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      render: formatDate,
      responsive: ['lg'],
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'default'}>{t(isActive ? 'common.active' : 'common.inactive')}</Tag>
      ),
      responsive: ['lg'],
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 110,
      render: (_, student) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(student);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title={t('common.confirmDelete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => handleDelete(student)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} disabled={!student.isActive} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.students')}
        extra={[
          <SearchInput key="search" value={query.search} onChange={query.applySearch} />,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            {t('common.add')}
          </Button>,
        ]}
      />

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data ?? []}
        pagination={false}
        scroll={{ x: 720 }}
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

      <StudentFormModal
        open={modalOpen}
        student={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
