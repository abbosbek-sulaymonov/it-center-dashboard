import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export function ErrorState({ error, onRetry }) {
  const { t } = useTranslation();

  return (
    <Result
      status="warning"
      title={t('common.somethingWentWrong')}
      subTitle={error?.message}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        ) : null
      }
    />
  );
}
