import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { addDays, getTierThreeDeliveryDate } from '../deliveryDays';

export function getDaysBetween(start: Dayjs, end: Dayjs) {
	const range = [];
	let current = start;
	while (!current.isAfter(end)) {
		range.push(current);
		current = current.add(1, 'days');
	}
	return range;
}

describe('getTierThreeDeliveryDate', () => {
	it('will always find a delivery date at least 15 days from today', () => {
		const startDate = dayjs('2024-01-01');
		const endDate = dayjs('2024-12-31');
		const daysIn2024 = getDaysBetween(startDate, endDate);

		daysIn2024.map((day) => {
			const deliveryDate = dayjs(
				getTierThreeDeliveryDate(day.toDate().getTime()),
			);
			expect(deliveryDate.isAfter(day.add(15, 'day'))).toBe(true);
		});
	});
});
describe('addDays', () => {
	// The addDays function was written to avoid adding a dependency to support-frontend
	// this test checks its outputs against the Dayjs library to ensure correctness
	it('matches the output of Dayjs for a range of dates', () => {
		const testForDateAndNumberOfDays = (
			startDate: Dayjs,
			daysToAdd: number,
		) => {
			expect(addDays(startDate.toDate(), daysToAdd)).toEqual(
				startDate.add(daysToAdd, 'day').toDate(),
			);
		};
		testForDateAndNumberOfDays(dayjs('2024-01-01'), 1);
		testForDateAndNumberOfDays(dayjs('2024-01-01'), 31);
		testForDateAndNumberOfDays(dayjs('2024-12-31'), 3);
		testForDateAndNumberOfDays(dayjs('2024-02-28'), 3);
		testForDateAndNumberOfDays(dayjs('2024-02-29'), 1); // 2024 is a leap year
	});
});
