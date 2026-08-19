import { Col, Flex, Pagination, Row } from 'antd';
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

export default function StudentLibraryPage() {
  const { t } = useTranslation();
  const query = useTableQuery({ limit: 12 });

  const fetchBooks = useCallback(() => bookApi.list(query.params), [query.params]);
  const { data, meta, loading, error, refetch } = useApiResource(fetchBooks);

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={t('nav.library')}
        extra={[<SearchInput key="search" value={query.search} onChange={query.applySearch} />]}
      />

      {loading ? <LoadingScreen minHeight="40vh" /> : null}

      {!loading ? (
        data?.length ? (
          <>
            <Row gutter={[16, 16]}>
              {data.map((book) => (
                <Col key={book._id} xs={24} sm={12} lg={8} xl={6}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
            <Flex justify="flex-end" style={{ marginTop: 24 }}>
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
