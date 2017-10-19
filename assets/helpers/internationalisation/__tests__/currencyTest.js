// @flow

// ----- Imports ----- //

import { detect, GBP, USD, IsoCurrency } from '../currency';

let mockCurrency: ?IsoCurrency = null;

jest.mock('helpers/url', () => ({
  getQueryParameter: () => mockCurrency,
}));

// ----- Tests ----- //

describe('detect currency', () => {

  it('should return the currency for the supplied country if there is no query parameter set (GB)', () => {
    mockCurrency = null;
    expect(detect('GB')).toEqual(GBP);
  });

  it('should return the currency for the supplied country if there is no query parameter set (US)', () => {
    mockCurrency = null;
    expect(detect('US')).toEqual(USD);
  });

  it('should return GBP if the country is not recognised', () => {
    mockCurrency = null;
    expect(detect('ZZ')).toEqual(GBP);
  });

  it('should return the currency from the query parameter (USD)', () => {
    mockCurrency = 'USD';
    expect(detect('GB')).toEqual(USD);
  });

  it('should return the currency from the query parameter (GBP)', () => {
    mockCurrency = 'GBP';
    expect(detect('US')).toEqual(GBP);
  });

});
