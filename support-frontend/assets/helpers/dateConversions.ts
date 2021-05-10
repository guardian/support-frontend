const formatMachineDate = (date: Date) => [date.getFullYear().toString().padStart(4, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getDate().toString().padStart(2, '0')].join('-');

const formatUserDate = (date: Date) => date.toLocaleString('en', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export { formatMachineDate, formatUserDate };