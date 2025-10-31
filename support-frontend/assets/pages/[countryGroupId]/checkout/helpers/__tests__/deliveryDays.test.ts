// ----- Imports ----- //
// import type { PaperProductOptions } from '@modules/product/productOptions';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
// import type { ActiveProductKey } from 'helpers/productCatalog';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import {
	addDays,
	getTierThreeDeliveryDate,
	getWeeklyDays,
	getWeeklyDeliveryDate,
} from '../deliveryDays';

function getDaysBetween(start: Dayjs, end: Dayjs) {
	const range = [];
	let current = start;
	while (!current.isAfter(end)) {
		range.push(current);
		current = current.add(1, 'days');
	}
	return range;
}
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

// 2019-02-26T10:09:12.198Z
const tuesday = 1551175752198;

// 2019-03-07T00:20:18.000Z
const thursday = 1551918018000;

// 2019-03-10T00:00:00.000Z
const sunday = 1552176000000;

// 2019-12-09T11:38:40.247Z
const ninthOfDecember = 1575891520247;
const weeklyDayTests = [
	{
		desc: 'if you order before wednesday midnight, it delivers the Weekly on Friday week',
		day: tuesday,
		weeklyDate: '2019-03-08',
	},
	{
		desc: 'if you order after wednesday, it delivers the Weekly on Friday fortnight',
		day: thursday,
		weeklyDate: '2019-03-22',
	},
	{
		desc: 'if you order on a Sunday, it delivers the Weekly on Friday week',
		day: sunday,
		weeklyDate: '2019-03-22',
	},
	{
		desc: 'should not offer the 27th of December as a possible delivery date',
		day: ninthOfDecember,
		weeklyDate: undefined,
	},
];
describe.each(weeklyDayTests)('getWeeklyDays', ({ desc, day, weeklyDate }) => {
	it(desc, () => {
		const days = getWeeklyDays(day);
		if (weeklyDate) {
			expect(formatMachineDate(days[0]!)).toEqual(weeklyDate);
		} else {
			expect(
				days.find((d) => d.getDate() === 27 && d.getMonth() === 1),
			).toEqual(undefined);
			expect(days.length).toEqual(5);
		}
	});
});

describe('getWeeklyDeliveryDate', () => {
	it('will always find a delivery date greater than 8 days from today', () => {
		const startDate = dayjs('2026-01-01');
		const endDate = dayjs('2026-12-31');
		const daysIn2024 = getDaysBetween(startDate, endDate);

		daysIn2024.map((day) => {
			const deliveryDate = dayjs(getWeeklyDeliveryDate(day.toDate().getTime()));
			const eightDaysTime = day.add(8, 'day'); // earliest is before wednesday midnight, it delivers the Weekly on Friday week
			expect(deliveryDate.isAfter(eightDaysTime)).toBe(true);
		});
	});
});

describe('getTierThreeDeliveryDate', () => {
	it('will always find a delivery date at least 15 days from today', () => {
		const startDate = dayjs('2024-01-01');
		const endDate = dayjs('2024-12-31');
		const daysIn2024 = getDaysBetween(startDate, endDate);

		daysIn2024.map((day) => {
			const deliveryDate = dayjs(
				getTierThreeDeliveryDate(day.toDate().getTime()),
			);
			const fifteenDaysTime = day.add(15, 'day');
			expect(
				deliveryDate.isSame(fifteenDaysTime) ||
					deliveryDate.isAfter(fifteenDaysTime),
			).toBe(true);
		});
	});
});
