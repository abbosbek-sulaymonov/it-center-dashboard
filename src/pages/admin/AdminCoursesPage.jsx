import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Flex, Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { courseApi } from '@/api/course.api.js';
import { tutorApi } from '@/api/tutor.api.js';
import { CourseFormModal } from '@/components/course/CourseFormModal.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { COURSE_LEVEL_COLOR } from '@/constants/roles.js';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { formatPrice, readableError } from '@/utils/format.js';

export default function AdminCoursesPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 10, includeInactive: 'true' });

  const fetchCourses = useCallback(() => courseApi.list(query.params), [query.params]);
  const fetchTutors = useCallback(() => tutorApi.list({ limit: 100 }), []);

  const { data, meta, loading, error, refetch } = useApiResource(fetchCourses);
  const tutors = useApiResource(fetchTutors);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) await courseApi.update(editing._id, values);
      else await courseApi.create(values);
      setModalOpen(false);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    try {
      await courseApi.remove(course._id);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  const columns = [
    { title: t('course.title'), dataIndex: 'title', ellipsis: true },
    {
      title: t('course.tutor'),
      dataIndex: ['tutor', 'user', 'fullName'],
      render: (value) => value ?? t('course.noTutor'),
      responsive: ['md'],
    },
    { title: t('course.category'), dataIndex: 'category', responsive: ['lg'] },
    {
      title: t('course.level'),
      dataIndex: 'level',
      render: (level) => <Tag color={COURSE_LEVEL_COLOR[level]}>{t(`course.levels.${level}`)}</Tag>,
    },
    {
      title: t('course.price'),
      dataIndex: 'price',
      render: (price) => (price > 0 ? formatPrice(price, t('common.currency')) : t('common.free')),
      responsive: ['md'],
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
      render: (_, course) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(course)} />
          <Popconfirm
            title={t('common.confirmDelete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => handleDelete(course)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} disabled={!course.isActive} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.courses')}
        extra={[
          <SearchInput key="search" value={query.search} onChange={query.applySearch} />,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
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

      <CourseFormModal
        open={modalOpen}
        course={editing}
        tutors={tutors.data ?? []}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
