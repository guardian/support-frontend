import { formatMachineDate, formatUserDate } from '../dateConversions';

/* 2019-02-27 05:00 GMT */
const wednesday = 1551275752198;

describe('formatMachineDate', () => {
	it('formats date in YYYY-DD-MM format', () => {
		expect(formatMachineDate(new Date(wednesday))).toEqual('2019-02-27');
	});
});

describe('formatUserDate', () => {
	it('formats date in a readable format', () => {
		expect(formatUserDate(new Date(wednesday))).toEqual(
			'Wednesday, February 27, 2019',
		);
	});
});
