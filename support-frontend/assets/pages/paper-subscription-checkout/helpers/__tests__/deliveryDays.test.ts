// ----- Imports ----- //
import {
	Everyday,
	Sixday,
	Sunday,
	Weekend,
} from 'helpers/productPrice/productOptions';
import { DeliveryDays } from 'helpers/subscriptionsForms/deliveryDays';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import {
	canDeliverOnNextDeliveryDay,
	daysTillNextDelivery,
	getHomeDeliveryDays,
} from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getFormattedStartDate, getPaymentStartDate } from '../subsCardDays';
import { getVoucherDays } from '../voucherDeliveryDays';

jest.mock('ophan', () => {});
// ----- Tests ----- //
const monday = 1551075752198;

/* 2019-02-25 */
const tuesday = 1551175752198;

/* 2019-02-26 */
const wednesday5amGMT = 1551243600000;

/* 2019-02-27 05:00 GMT */
const wednesday = 1551275752198;

/* 2019-02-27 */
const thursday4am = 1551326400000;

/* 2019-02-28 04:00 GMT */
const thursday = 1551312000000;

/* 2019-02-28 */
const saturday = 1551484800000;

/* 2019-03-02 */
const sunday = 1551577952198;

/* 2019-03-03 */
describe('deliveryDays', () => {
	describe('date formatters', () => {
		it('formatMachineDate formats date in YYYY-DD-MM format', () => {
			expect(formatMachineDate(new Date(wednesday))).toEqual('2019-02-27');
		});
		it('formatUserDate formats date in a readable format', () => {
			expect(formatUserDate(new Date(wednesday))).toEqual(
				'Wednesday, February 27, 2019',
			);
		});
	});
	describe('getHomeDeliveryDays', () => {
		it('can work out the number of days till the next delivery', () => {
			expect(
				daysTillNextDelivery(DeliveryDays.Monday, DeliveryDays.Tuesday),
			).toEqual(1);
			expect(
				daysTillNextDelivery(DeliveryDays.Monday, DeliveryDays.Friday),
			).toEqual(4);
			expect(
				daysTillNextDelivery(DeliveryDays.Friday, DeliveryDays.Monday),
			).toEqual(3);
			expect(
				daysTillNextDelivery(DeliveryDays.Wednesday, DeliveryDays.Sunday),
			).toEqual(4);
		});
		it('can work out whether we can deliver on the next delivery date', () => {
			expect(
				canDeliverOnNextDeliveryDay(
					DeliveryDays.Tuesday,
					DeliveryDays.Sunday,
					4,
				),
			).toEqual(true);
			expect(
				canDeliverOnNextDeliveryDay(
					DeliveryDays.Wednesday,
					DeliveryDays.Saturday,
					4,
				),
			).toEqual(false);
			expect(
				canDeliverOnNextDeliveryDay(
					DeliveryDays.Saturday,
					DeliveryDays.Monday,
					3,
				),
			).toEqual(false);
			expect(
				canDeliverOnNextDeliveryDay(
					DeliveryDays.Wednesday,
					DeliveryDays.Sunday,
					4,
				),
			).toEqual(true);
		});
		it('delivers the Sunday paper on the next Sunday', () => {
			const days = getHomeDeliveryDays(wednesday, 'Sunday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-03');
		});
		it('delivers first Sixday paper 6 days later if ordered on a Thursday', () => {
			const days = getHomeDeliveryDays(thursday, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-06');
		});
		it('delivers first Weekend paper 9 days later if ordered on a Thursday', () => {
			const days = getHomeDeliveryDays(thursday, 'Weekend');
			expect(formatMachineDate(days[0])).toEqual('2019-03-09');
		});
		it('delivers first Sunday paper 10 days later if ordered on a Thursday', () => {
			const days = getHomeDeliveryDays(thursday, 'Sunday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-10');
		});
		it('delivers first Weekend paper 5 days later if ordered on a Monday', () => {
			const days = getHomeDeliveryDays(monday, 'Weekend');
			expect(formatMachineDate(days[0])).toEqual('2019-03-02');
		});
		it('delivers first Everyday paper 4 days later if ordered on a Saturday', () => {
			const days = getHomeDeliveryDays(saturday, 'Everyday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-06');
		});
	});
	describe('getVoucherDays', () => {
		it('outside of the fast delivery window, delivers the Saturday paper on the next Saturday, four weeks after the preceding Monday', () => {
			const days = getVoucherDays(wednesday, 'Saturday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-30');
		});
		it('outside the fast delivery window (early morning), delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
			const days = getVoucherDays(thursday4am, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-25');
		});
		it('outside the fast delivery window, delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
			const days = getVoucherDays(wednesday, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-25');
		});
		it('outside the fast delivery window (on a Sunday), delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
			const days = getVoucherDays(sunday, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-25');
		});
		it('in the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
			const days = getVoucherDays(tuesday, 'Saturday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-23');
		});
		it('just inside the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
			const days = getVoucherDays(wednesday5amGMT, 'Saturday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-23');
		});
		it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday', () => {
			const days = getVoucherDays(tuesday, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-18');
		});
		it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday - even on a Monday', () => {
			const days = getVoucherDays(monday, 'Sixday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-18');
		});
		it('inside the fast delivery window, delivers Sunday on the next Sunday, three weeks after the preceding Monday', () => {
			const days = getVoucherDays(tuesday, 'Sunday');
			expect(formatMachineDate(days[0])).toEqual('2019-03-24');
		});
	});
	describe('getPaymentStartDate', () => {
		it('Should return the correct payment start date', () => {
			const today = 1596727469480;
			const day = getFormattedStartDate(getPaymentStartDate(today, Everyday));
			expect(day).toBe('17 August 2020');
			const day1 = getFormattedStartDate(getPaymentStartDate(today, Sixday));
			expect(day1).toBe('17 August 2020');
			const day2 = getFormattedStartDate(getPaymentStartDate(today, Weekend));
			expect(day2).toBe('22 August 2020');
			const day3 = getFormattedStartDate(getPaymentStartDate(today, Sunday));
			expect(day3).toBe('23 August 2020');
		});
	});
});
