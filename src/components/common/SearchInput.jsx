import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Search box that only reports upward after the user stops typing, so a list
 * screen does not fire a request per keystroke.
 */
export function SearchInput({ value = '', onChange, delay = 350, style }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  // Keep in step when the parent resets the query (e.g. clearing filters).
  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft === value) return undefined;
    const timer = setTimeout(() => onChange(draft), delay);
    return () => clearTimeout(timer);
  }, [draft, value, delay, onChange]);

  return (
    <Input.Search
      allowClear
      value={draft}
      placeholder={t('common.searchPlaceholder')}
      onChange={(event) => setDraft(event.target.value)}
      onSearch={onChange}
      style={{ maxWidth: 320, ...style }}
    />
  );
}
