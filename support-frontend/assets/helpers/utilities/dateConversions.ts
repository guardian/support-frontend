import type { DateYMDString } from 'helpers/types/DateString';

const formatMachineDate = (date: Date): DateYMDString =>
	[
		date.getFullYear().toString().padStart(4, '0'),
		(date.getMonth() + 1).toString().padStart(2, '0'),
		date.getDate().toString().padStart(2, '0'),
	].join('-') as DateYMDString;

const formatUserDate = (date: Date): string =>
	date.toLocaleString('en', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

export { formatMachineDate, formatUserDate };
