import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '@/constants/routes.js';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title={t('common.notFoundTitle')}
      subTitle={t('common.notFoundText')}
      extra={
        <Button type="primary" onClick={() => navigate(PATHS.home)}>
          {t('common.goHome')}
        </Button>
      }
    />
  );
}
