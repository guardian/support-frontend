// @flow

// ----- Imports ----- //

import { Annual, Monthly } from 'helpers/billingPeriods';
// eslint-disable-next-line import/extensions
import { getSummary } from '../promotionSummary.jsx';

jest.mock('ophan', () => {});

// ----- Tests ----- //


describe('promotionSummary', () => {

  it('should generate correct summaries for monthly and annual billing periods', () => {
    expect(getSummary('£', 11.99, 8.99, 3, Monthly))
      .toEqual('£8.99/month for 3 months, then standard rate (£11.99/month)');

    expect(getSummary('$', 119.90, 112.41, 1, Annual))
      .toEqual('$112.41 for 1 year, then standard rate ($119.90/year)');
  });

  it('should use an empty summary for a promotion without an end date', () => {
    expect(getSummary('€', 119.90, 112.41, null, Annual))
      .toEqual(null);
  });

});
