import dayjs from 'dayjs';

/** Uzbek sum, grouped with thin spaces. Zero is presented as "free" upstream. */
export function formatPrice(value, currencyLabel) {
  const amount = Number(value) || 0;
  return `${amount.toLocaleString('uz-UZ')} ${currencyLabel}`;
}

export function formatDate(value) {
  return value ? dayjs(value).format('DD.MM.YYYY') : '—';
}

export function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Backend errors carry field-level `details`; surface the first one so a form
 * shows something more useful than a generic message.
 */
export function readableError(error, fallback) {
  if (!error) return fallback;
  if (error.details?.length) return `${error.message}: ${error.details[0].message}`;
  return error.message || fallback;
}
