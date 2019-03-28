// @flow

// ----- Imports ----- //
jest.mock('helpers/globals', () => ({
  __esModule: true,
  isSwitchOn: jest.fn(),
}));

const mock = (mockFn: any) => mockFn;

import { getValidPaymentMethods, getPaymentMethodToSelect } from '../checkouts';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import { isSwitchOn } from 'helpers/globals';

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
      expect(getValidPaymentMethods(contributionType, allSwitches, countryId)).toEqual([DirectDebit, Stripe, PayPal]);
      expect(getPaymentMethodToSelect(contributionType, allSwitches, countryId)).toEqual(DirectDebit);

    });

    it('should return en empty array/\'None\' for Monthly Recurring UK when switches are all off', () => {
      const contributionType = 'MONTHLY';
      const countryId = 'GB';
      mock(isSwitchOn).mockImplementation(() => false);
      expect(getValidPaymentMethods(contributionType, allSwitches, countryId)).toEqual([]);
      expect(getPaymentMethodToSelect(contributionType, allSwitches, countryId)).toEqual('None');

    });

    it('should return just Stripe for One Off US when only Stripe is on', () => {
      const contributionType = 'ONE_OFF';
      const countryId = 'US';
      mock(isSwitchOn).mockImplementation(key => key === 'oneOffPaymentMethods.stripe');
      expect(getValidPaymentMethods(contributionType, allSwitches, countryId)).toEqual([Stripe]);
      expect(getPaymentMethodToSelect(contributionType, allSwitches, countryId)).toEqual(Stripe);

    });

  });
});
