import { Col, Flex, Pagination, Row, Select } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { bookApi } from '@/api/book.api.js';
import { BookCard } from '@/components/book/BookCard.jsx';
import { EmptyState } from '@/components/common/EmptyState.jsx';
import { ErrorState } from '@/components/common/ErrorState.jsx';
import { LoadingScreen } from '@/components/common/LoadingScreen.jsx';
import { PageHeader } from '@/components/common/PageHeader.jsx';
import { SearchInput } from '@/components/common/SearchInput.jsx';
import { useApiResource } from '@/hooks/useApiResource.js';
import { useTableQuery } from '@/hooks/useTableQuery.js';

export default function BookCatalogPage() {
  const { t } = useTranslation();
  const query = useTableQuery({ limit: 12, category: undefined });

  const fetchBooks = useCallback(() => bookApi.list(query.params), [query.params]);
  const fetchCategories = useCallback(() => bookApi.categories(), []);

  const { data, meta, loading, error, refetch } = useApiResource(fetchBooks);
  const categories = useApiResource(fetchCategories);

  return (
    <div className="page-container">
      <PageHeader
        title={t('nav.library')}
        extra={[
          <SearchInput key="search" value={query.search} onChange={query.applySearch} />,
          <Select
            key="category"
            allowClear
            style={{ minWidth: 160 }}
            placeholder={t('book.category')}
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
              {data.map((book) => (
                <Col key={book._id} xs={24} sm={12} lg={6}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
            <Flex justify="center" style={{ marginTop: 32 }}>
              <Pagination
                current={meta?.page ?? 1}
                pageSize={meta?.limit ?? 12}
                total={meta?.total ?? 0}
                showSizeChanger={false}
                onChange={query.setPage}
              />
            </Flex>
          </>
        ) : (
          <EmptyState description={t('book.empty')} />
        )
      ) : null}
    </div>
  );
}
