// ----- Imports ----- //
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from '../deliveryDays';

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
