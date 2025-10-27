// ----- Imports ----- //
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import {
	addDays,
	getProductFirstDeliveryOrStartDate,
	getTierThreeDeliveryDate,
	getWeeklyDays,
} from '../deliveryDays';

export function getDaysBetween(start: Dayjs, end: Dayjs) {
	const range = [];
	let current = start;
	while (!current.isAfter(end)) {
		range.push(current);
		current = current.add(1, 'days');
	}
	return range;
}

// 2019-02-26T10:09:12.198Z
const tuesday = 1551175752198;

// 2019-03-07T00:20:18.000Z
const thursday = 1551918018000;

// 2019-03-10T00:00:00.000Z
const sunday = 1552176000000;

// 2019-12-09T11:38:40.247Z
const ninthOfDecember = 1575891520247;

describe('getWeeklyDays', () => {
	it('if you order after wednesday, it delivers the Weekly on Friday fortnight', () => {
		const days = getWeeklyDays(thursday);
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-22');
	});

	it('if you order before wednesday midnight, it delivers the Weekly on Friday week', () => {
		const days = getWeeklyDays(tuesday);
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-08');
	});

	it('if you order on a Sunday, it delivers the Weekly on Friday week', () => {
		const days = getWeeklyDays(sunday);
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-22');
	});

	it('should not offer the 27th of December as a possible delivery date', () => {
		const days = getWeeklyDays(ninthOfDecember);
		expect(days.find((d) => d.getDate() === 27 && d.getMonth() === 1)).toEqual(
			undefined,
		);
		expect(days.length).toEqual(5);
	});
});

const deliveryTests = [
	{
		product: 'NationalDelivery',
		paperProductOption: 'EverydayPlus',
		startDate: `2025-08-19`,
		firstDeliveryDate: '2025-08-22',
	},
	{
		product: 'GuardianWeeklyDomestic',
		startDate: `2025-10-27`,
		firstDeliveryDate: '2025-11-07',
	},
	{
		product: 'TierThree',
		startDate: `2025-10-27`,
		firstDeliveryDate: '2025-11-14',
	},
	{
		product: 'GuardianAdLite',
		startDate: `2025-10-27`,
		firstDeliveryDate: '2025-11-11',
	},
	{
		product: 'SupporterPlus',
		startDate: `2025-10-27`,
		firstDeliveryDate: undefined,
	},
];

describe('productDeliveryOrStartDate', () => {
	deliveryTests.map((deliveryTest) => {
		it(`for product ${deliveryTest.product} ${
			deliveryTest.paperProductOption ?? ''
		}, returns first delivery date ${
			deliveryTest.firstDeliveryDate
		} using start date ${deliveryTest.startDate} `, () => {
			// Mock the current date/time
			const orderDate = new Date(deliveryTest.startDate);
			jest.useFakeTimers().setSystemTime(orderDate);

			const firstDeliveryDate = getProductFirstDeliveryOrStartDate(
				deliveryTest.product as ActiveProductKey,
				deliveryTest.paperProductOption as PaperProductOptions | undefined,
			);

			if (!deliveryTest.firstDeliveryDate) {
				expect(expect(firstDeliveryDate).toBeUndefined());
			} else {
				expect(firstDeliveryDate).not.toBeUndefined();
				if (firstDeliveryDate) {
					expect(formatMachineDate(firstDeliveryDate)).toEqual(
						deliveryTest.firstDeliveryDate,
					);
				}
			}

			// Restore the original date/time
			jest.useRealTimers();
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
