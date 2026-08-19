import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Avatar, Button, Flex, Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { tutorApi } from '@/api/tutor.api.js';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { TutorFormModal } from '@/components/people/TutorFormModal.jsx';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { initialsOf, readableError } from '@/utils/format.js';

export default function AdminTutorsPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 10, includeInactive: 'true' });

  const fetchTutors = useCallback(() => tutorApi.list(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchTutors);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) await tutorApi.update(editing._id, values);
      else await tutorApi.create(values);
      setModalOpen(false);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tutor) => {
    try {
      await tutorApi.remove(tutor._id);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  const columns = [
    {
      title: t('auth.fullName'),
      key: 'name',
      render: (_, tutor) => (
        <Space>
          <Avatar src={tutor.user?.avatarUrl || null}>{initialsOf(tutor.user?.fullName ?? '')}</Avatar>
          {tutor.user?.fullName}
        </Space>
      ),
    },
    { title: t('auth.email'), dataIndex: ['user', 'email'], responsive: ['md'] },
    { title: t('tutor.specialization'), dataIndex: 'specialization', responsive: ['lg'] },
    {
      title: t('tutor.experience'),
      dataIndex: 'experienceYears',
      render: (years) => (years ? t('tutor.experienceYears', { count: years }) : '—'),
      responsive: ['lg'],
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'default'}>{t(isActive ? 'common.active' : 'common.inactive')}</Tag>
      ),
      responsive: ['md'],
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 110,
      render: (_, tutor) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(tutor);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title={t('common.confirmDelete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => handleDelete(tutor)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} disabled={!tutor.isActive} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.tutors')}
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

      <TutorFormModal
        open={modalOpen}
        tutor={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
