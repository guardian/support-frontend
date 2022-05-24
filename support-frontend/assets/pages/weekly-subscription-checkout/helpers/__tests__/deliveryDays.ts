// ----- Imports ----- //
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from '../deliveryDays';
// ----- Tests ----- //
const tuesday = 1551175752198;

/* 2019-02-26 */
const friday = 1551399618000;

/* 2019-03-01 */
const thursday = 1551918018000;

/* 2019-03-07 */
const sunday = 1552176000000;

/* 2019-03-10 */
const ninthOfDecember = 1575891520247;

/* 2019-12-09 */
describe('deliveryDays', () => {
	describe('date formatters', () => {
		it('formatMachineDate formats date in YYYY-DD-MM format', () => {
			expect(formatMachineDate(new Date(friday))).toEqual('2019-03-01');
		});
		it('formatUserDate formats date in a readable format', () => {
			expect(formatUserDate(new Date(friday))).toEqual('Friday, March 1, 2019');
		});
	});
	describe('getWeeklyDays', () => {
		it('if you order after wednesday, it delivers the Weekly on Friday fortnight', () => {
			const days = getWeeklyDays(thursday);
			expect(formatMachineDate(days[0])).toEqual('2019-03-22');
		});
		it('if you order before wednesday midnight, it delivers the Weekly on Friday week', () => {
			const days = getWeeklyDays(tuesday);
			expect(formatMachineDate(days[0])).toEqual('2019-03-08');
		});
		it('if you order on a Sunday, it delivers the Weekly on Friday week', () => {
			const days = getWeeklyDays(sunday);
			expect(formatMachineDate(days[0])).toEqual('2019-03-22');
		});
		it('should not offer the 27th of December as a possible delivery date', () => {
			const days = getWeeklyDays(ninthOfDecember);
			expect(
				days.find((d) => d.getDate() === 27 && d.getMonth() === 1),
			).toEqual(undefined);
			expect(days.length).toEqual(5);
		});
	});
});
