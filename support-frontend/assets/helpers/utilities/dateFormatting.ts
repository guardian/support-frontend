export function getLongMonth(date: Date): string {
	return date.toLocaleDateString('default', {
		month: 'long',
	});
}

export function getNumericYear(date: Date): string {
	return date.toLocaleDateString('default', {
		year: 'numeric',
	});
}

function nth(d: number) {
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

export function getDateWithOrdinal(date: Date): string {
	const dayOfMonth = date.getDate();
	return `${dayOfMonth}${nth(dayOfMonth)}`;
}

export function getDateString(date: Date): string {
	const day = getDateWithOrdinal(date);
	const month = getLongMonth(date);
	const year = getNumericYear(date);
	return `${day} ${month} ${year}`;
}
