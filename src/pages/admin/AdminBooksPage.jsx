import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Flex, Pagination, Popconfirm, Space, Table, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { bookApi } from '@/api/book.api.js';
import { BookFormModal } from '@/components/book/BookFormModal.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';
import { readableError } from '@/utils/format.js';

export default function AdminBooksPage() {
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const query = useTableQuery({ limit: 10, includeInactive: 'true' });

  const fetchBooks = useCallback(() => bookApi.list(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchBooks);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) await bookApi.update(editing._id, values);
      else await bookApi.create(values);
      setModalOpen(false);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (book) => {
    try {
      await bookApi.remove(book._id);
      await refetch();
    } catch (caught) {
      message.error(readableError(caught, t('common.somethingWentWrong')));
    }
  };

  const columns = [
    { title: t('book.title'), dataIndex: 'title', ellipsis: true },
    { title: t('book.author'), dataIndex: 'author', responsive: ['md'] },
    { title: t('book.category'), dataIndex: 'category', responsive: ['lg'] },
    { title: t('book.publishedYear'), dataIndex: 'publishedYear', responsive: ['lg'] },
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
      render: (_, book) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(book);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title={t('common.confirmDelete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            onConfirm={() => handleDelete(book)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} disabled={!book.isActive} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.books')}
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

      <BookFormModal
        open={modalOpen}
        book={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
