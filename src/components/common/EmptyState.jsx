import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

export function EmptyState({ description, children }) {
  const { t } = useTranslation();

  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description ?? t('common.noData')}
      style={{ padding: '48px 0' }}
    >
      {children}
    </Empty>
  );
}
