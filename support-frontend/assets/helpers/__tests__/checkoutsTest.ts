// ----- Imports ----- //
jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	isSwitchOn: jest.fn(),
}));

const mock = (mockFn: any) => mockFn;

import {
	getValidPaymentMethods,
	getPaymentMethodToSelect,
} from '../forms/checkouts';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
// ----- Tests ----- //
describe('checkouts', () => {
	describe('getValidPaymentMethods and getPaymentMethodToSelect', () => {
		const allSwitches = {
			experiments: {},
		};
		it('should return correct values for Monthly Recurring UK when switches are all on', () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			mock(isSwitchOn).mockImplementation(() => true);
			expect(
				getValidPaymentMethods(contributionType, allSwitches, countryId, true),
			).toEqual([DirectDebit, Stripe, PayPal]);
			expect(
				getPaymentMethodToSelect(
					contributionType,
					allSwitches,
					countryId,
					true,
				),
			).toEqual(DirectDebit);
		});
		it("should return en empty array/'None' for Monthly Recurring UK when switches are all off", () => {
			const contributionType = 'MONTHLY';
			const countryId = 'GB';
			mock(isSwitchOn).mockImplementation(() => false);
			expect(
				getValidPaymentMethods(contributionType, allSwitches, countryId, true),
			).toEqual([]);
			expect(
				getPaymentMethodToSelect(
					contributionType,
					allSwitches,
					countryId,
					true,
				),
			).toEqual('None');
		});
		it('should return just Stripe for One Off US when only Stripe is on', () => {
			const contributionType = 'ONE_OFF';
			const countryId = 'US';
			mock(isSwitchOn).mockImplementation(
				(key) => key === 'oneOffPaymentMethods.stripe',
			);
			expect(
				getValidPaymentMethods(contributionType, allSwitches, countryId, true),
			).toEqual([Stripe]);
			expect(
				getPaymentMethodToSelect(
					contributionType,
					allSwitches,
					countryId,
					true,
				),
			).toEqual(Stripe);
		});
	});
});
