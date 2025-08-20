// ----- Imports ----- //

import { formatMachineDate } from 'helpers/utilities/dateConversions';
import {
	canDeliverOnNextDeliveryDay,
	daysTillNextDelivery,
	getHomeDeliveryDays,
} from '../homeDeliveryDays';

const DeliveryDays = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};

// 2019-02-25T06:22:32.198Z
const monday = 1551075752198;

// 2019-02-27T13:55:52.198Z
const wednesday = 1551275752198;

// 2019-02-28T00:00:00.000Z
const thursday = 1551312000000;

// 2019-03-02T00:00:00.000Z
const saturday = 1551484800000;

describe('daysTillNextDelivery', () => {
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
});

describe('canDeliverOnNextDeliveryDay', () => {
	it('can work out whether we can deliver on the next delivery date', () => {
		expect(
			canDeliverOnNextDeliveryDay(DeliveryDays.Tuesday, DeliveryDays.Sunday, 4),
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
});

describe('getHomeDeliveryDays', () => {
	it('delivers the Sunday paper on the next Sunday', () => {
		const days = getHomeDeliveryDays(wednesday, 'Sunday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-03');
	});

	it('delivers first Sixday paper 6 days later if ordered on a Thursday', () => {
		const days = getHomeDeliveryDays(thursday, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-06');
	});

	it('delivers first Weekend paper 9 days later if ordered on a Thursday', () => {
		const days = getHomeDeliveryDays(thursday, 'Weekend');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-09');
	});

	it('delivers first Sunday paper 10 days later if ordered on a Thursday', () => {
		const days = getHomeDeliveryDays(thursday, 'Sunday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-10');
	});

	it('delivers first Weekend paper 5 days later if ordered on a Monday', () => {
		const days = getHomeDeliveryDays(monday, 'Weekend');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-02');
	});

	it('delivers first Everyday paper 4 days later if ordered on a Saturday', () => {
		const days = getHomeDeliveryDays(saturday, 'Everyday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-06');
	});
});
