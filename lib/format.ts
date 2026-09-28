const numberFormat = new Intl.NumberFormat('en-GB');
const moneyFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' });
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

export const formatNumber = (value: number) => numberFormat.format(value);

export const formatMoney = (cents: number) => moneyFormat.format(cents / 100);

export const formatPercent = (ratio: number) => `${(ratio * 100).toFixed(2)}%`;

export const formatDate = (isoDate: string) => dateFormat.format(new Date(isoDate));

export const formatDay = (isoDate: string) => dayFormat.format(new Date(isoDate));
