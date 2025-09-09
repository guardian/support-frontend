// ----- Imports ----- //

import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { currencies } from 'helpers/internationalisation/currency';
import { getValidPaymentMethods, simpleFormatAmount } from '../forms/checkouts';

jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	isSwitchOn: jest.fn(),
}));

const mock = (mockFn: unknown) => mockFn as jest.Mock;

// ----- Tests ----- //

describe('checkouts', () => {
	describe('getValidPaymentMethods', () => {
		it('should return correct values for Monthly Recurring UK when switches are all on', () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			const countryGroupId: CountryGroupId = 'GBPCountries';
			mock(isSwitchOn).mockImplementation(() => true);

			expect(
				getValidPaymentMethods(contributionType, countryId, countryGroupId),
			).toEqual([DirectDebit, Stripe, PayPal]);
		});

		it("should return en empty array/'None' for Monthly Recurring UK when switches are all off", () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			const countryGroupId: CountryGroupId = 'GBPCountries';
			mock(isSwitchOn).mockImplementation(() => false);

			expect(
				getValidPaymentMethods(contributionType, countryId, countryGroupId),
			).toEqual([]);
		});

		it('should return just Stripe for One Off US when only Stripe is on', () => {
			const contributionType = 'ONE_OFF';
			const countryId = 'US';
			const countryGroupId: CountryGroupId = 'UnitedStates';
			mock(isSwitchOn).mockImplementation(
				(key) => key === 'oneOffPaymentMethods.stripe',
			);

			expect(
				getValidPaymentMethods(contributionType, countryId, countryGroupId),
			).toEqual([Stripe]);
		});
	});

	describe('simpleFormatAmount', () => {
		it.each([
			[currencies.GBP, 12, '£12'],
			[currencies.NZD, 12.5, '$12.50'],
			[currencies.CAD, 12.0005, '$12'],
			[currencies.CAD, 12.015, '$12.02'],
		])(`%i%i should format as %i`, (currency, amount, expected) => {
			expect(simpleFormatAmount(currency, amount)).toBe(expected);
		});
	});
});
