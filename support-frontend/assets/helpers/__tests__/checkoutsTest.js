// @flow

// ----- Imports ----- //

import { getValidPaymentMethods, getPaymentMethodToSelect } from '../checkouts';

// ----- Tests ----- //


describe('checkouts', () => {

  describe('getValidPaymentMethods and getPaymentMethodToSelect', () => {

    const allSwitchesOn = {
      oneOffPaymentMethods: {
        stripe: 'On',
        payPal: 'On',
      },
      recurringPaymentMethods: {
        stripe: 'On',
        payPal: 'On',
        directDebit: 'On',
      },
      experiments: {},
    };

    const allSwitchesOff = {
      oneOffPaymentMethods: {
        stripe: 'Off',
        payPal: 'Off',
      },
      recurringPaymentMethods: {
        stripe: 'Off',
        payPal: 'Off',
        directDebit: 'Off',
      },
      experiments: {},
    };

    it('should return correct values for Monthly Recurring UK when switches are all on', () => {
      const contributionType = 'MONTHLY';
      const countryId = 'GB';
      expect(getValidPaymentMethods(contributionType, allSwitchesOn, countryId)).toEqual(['DirectDebit', 'Stripe', 'PayPal']);
      expect(getPaymentMethodToSelect(contributionType, allSwitchesOn, countryId)).toEqual('DirectDebit');

    });

    it('should return en empty array/\'None\' for Monthly Recurring UK when switches are all off', () => {
      const contributionType = 'MONTHLY';
      const countryId = 'GB';
      expect(getValidPaymentMethods(contributionType, allSwitchesOff, countryId)).toEqual([]);
      expect(getPaymentMethodToSelect(contributionType, allSwitchesOff, countryId)).toEqual('None');

    });

    it('should return just Stripe for One Off US when only Stripe is on', () => {
      const contributionType = 'ONE_OFF';
      const justStripeOn = { ...allSwitchesOff, oneOffPaymentMethods: { ...allSwitchesOff.oneOffPaymentMethods, stripe: 'On' } };
      const countryId = 'US';
      expect(getValidPaymentMethods(contributionType, justStripeOn, countryId)).toEqual(['Stripe']);
      expect(getPaymentMethodToSelect(contributionType, justStripeOn, countryId)).toEqual('Stripe');

    });

  });
});
