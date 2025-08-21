// ----- Imports ----- //

import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getVoucherDays } from '../voucherDeliveryDays';

// 2019-02-25T06:22:32.198Z
const monday = 1551075752198;

// 2019-02-26T10:09:12.198Z
const tuesday = 1551175752198;

// 2019-02-27T05:00:00.000Z
const wednesday5amGMT = 1551243600000;

// 2019-02-27T13:55:52.198Z
const wednesday = 1551275752198;

// 2019-02-28T04:00:00.000Z
const thursday4am = 1551326400000;

// 2019-03-03T01:52:32.198Z
const sunday = 1551577952198;

describe('getVoucherDays', () => {
	it('outside of the fast delivery window, delivers the Saturday paper on the next Saturday, four weeks after the preceding Monday', () => {
		const days = getVoucherDays(wednesday, 'Saturday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-30');
	});

	it('outside the fast delivery window (early morning), delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
		const days = getVoucherDays(thursday4am, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-25');
	});

	it('outside the fast delivery window, delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
		const days = getVoucherDays(wednesday, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-25');
	});

	it('outside the fast delivery window (on a Sunday), delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
		const days = getVoucherDays(sunday, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-25');
	});

	it('in the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
		const days = getVoucherDays(tuesday, 'Saturday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-23');
	});

	it('just inside the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
		const days = getVoucherDays(wednesday5amGMT, 'Saturday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-23');
	});

	it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday', () => {
		const days = getVoucherDays(tuesday, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-18');
	});

	it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday - even on a Monday', () => {
		const days = getVoucherDays(monday, 'Sixday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-18');
	});

	it('inside the fast delivery window, delivers Sunday on the next Sunday, three weeks after the preceding Monday', () => {
		const days = getVoucherDays(tuesday, 'Sunday');
		expect(formatMachineDate(days[0]!)).toEqual('2019-03-24');
	});
});
