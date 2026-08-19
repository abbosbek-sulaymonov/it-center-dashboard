import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '@/i18n/index.js';

export function LanguageSwitcher({ type = 'text' }) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  const items = SUPPORTED_LANGUAGES.map((language) => ({
    key: language.code,
    label: language.label,
  }));

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items,
        selectable: true,
        selectedKeys: [current],
        onClick: ({ key }) => i18n.changeLanguage(key),
      }}
    >
      <Button type={type} icon={<GlobalOutlined />}>
        {current.toUpperCase()}
      </Button>
    </Dropdown>
  );
}
