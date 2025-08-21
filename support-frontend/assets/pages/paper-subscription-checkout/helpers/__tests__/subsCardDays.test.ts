// ----- Imports ----- //

import { Everyday, Saturday, Weekend } from '@modules/product/productOptions';
import { getFormattedStartDate, getPaymentStartDate } from '../subsCardDays';

describe('getPaymentStartDate', () => {
	it('returns the correct payment start date', () => {
		const today = 1596727469480;

		const day = getFormattedStartDate(getPaymentStartDate(today, Everyday));
		expect(day).toBe('17 August 2020');

		const day2 = getFormattedStartDate(getPaymentStartDate(today, Weekend));
		expect(day2).toBe('22 August 2020');

		const day3 = getFormattedStartDate(getPaymentStartDate(today, Saturday));
		expect(day3).toBe('22 August 2020');
	});
});
