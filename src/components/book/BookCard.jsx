import { Button, Card, Flex, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { CoverImage } from '@/components/common/CoverImage.jsx';

const { Paragraph, Text } = Typography;

export function BookCard({ book, actions }) {
  const { t } = useTranslation();

  return (
    <Card
      cover={<CoverImage src={book.imageUrl} alt={book.title} />}
      actions={actions}
      styles={{ body: { display: 'flex', flexDirection: 'column', gap: 8 } }}
      style={{ height: '100%' }}
    >
      <Flex gap={8} wrap>
        {book.category ? <Tag>{book.category}</Tag> : null}
        {book.publishedYear ? <Tag>{book.publishedYear}</Tag> : null}
      </Flex>

      <Text strong style={{ fontSize: 16 }}>
        {book.title}
      </Text>
      {book.author ? <Text type="secondary">{book.author}</Text> : null}

      <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
        {book.description}
      </Paragraph>

      {book.fileUrl ? (
        <Button
          type="link"
          href={book.fileUrl}
          target="_blank"
          rel="noreferrer noopener"
          style={{ padding: 0 }}
        >
          {t('book.read')}
        </Button>
      ) : null}
    </Card>
  );
}
