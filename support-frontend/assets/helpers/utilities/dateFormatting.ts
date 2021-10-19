export function getLongMonth(date: Date) {
  return date.toLocaleDateString('default', {
    month: 'long'
  });
}

function nth(d) {
  if (d >= 11 && d <= 13) {
    return 'th';
  }

  switch (d % 10) {
    case 1:
      return 'st';

    case 2:
      return 'nd';

    case 3:
      return 'rd';

    default:
      return 'th';
  }
}

export function getDateWithOrdinal(date: Date) {
  const dayOfMonth = date.getDate();
  return `${dayOfMonth}${nth(dayOfMonth)}`;
}