import { PictureOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useState } from 'react';

/**
 * Card cover that falls back to a neutral placeholder when the URL is empty or
 * fails to load — catalogue data often arrives with broken image links.
 */
export function CoverImage({ src, alt, height = 180 }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ height, background: 'var(--surface-muted)', color: 'var(--text-muted)' }}
      >
        <PictureOutlined style={{ fontSize: 32 }} />
      </Flex>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ height, width: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}
