// ----- Imports ----- //

import {
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	PayPal,
	Stripe,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getValidPaymentMethods } from '../forms/checkouts';

jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	isSwitchOn: jest.fn(),
}));

const mock = (mockFn: unknown) => mockFn as jest.Mock;

// ----- Tests ----- //

describe('checkouts', () => {
	describe('getValidPaymentMethods', () => {
		const allSwitches = {
			experiments: {},
		};

		it('should return correct values for Monthly Recurring UK when switches are all on', () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			const countryGroupId: CountryGroupId = 'GBPCountries';
			mock(isSwitchOn).mockImplementation(() => true);

			expect(
				getValidPaymentMethods(
					contributionType,
					allSwitches,
					countryId,
					countryGroupId,
				),
			).toEqual([
				DirectDebit,
				ExistingCard,
				ExistingDirectDebit,
				Stripe,
				PayPal,
			]);
		});

		it("should return en empty array/'None' for Monthly Recurring UK when switches are all off", () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			const countryGroupId: CountryGroupId = 'GBPCountries';
			mock(isSwitchOn).mockImplementation(() => false);

			expect(
				getValidPaymentMethods(
					contributionType,
					allSwitches,
					countryId,
					countryGroupId,
				),
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
				getValidPaymentMethods(
					contributionType,
					allSwitches,
					countryId,
					countryGroupId,
				),
			).toEqual([Stripe]);
		});
	});
});
