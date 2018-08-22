// @flow

// ----- Imports ----- //

import { parseExperimentsFromGaData, parseExperimentFromQueryParam } from '../optimize';

// ----- Tests ----- //

jest.mock('ophan', () => ({ viewId: '123456' }));

describe('optimize', () => {

  describe('parseExperimentsFromGaData', () => {
    it('should return Optimize experiments when the provided data is in the correct format', () => {
      const data = { a: '1', b: '2' };
      expect(parseExperimentsFromGaData(data)).toMatchObject(data);
    });

    it('should return an empty object when the raw data is not in the correct format', () => {
      const data = { a: 1, b: 2 };
      expect(parseExperimentsFromGaData(data)).toMatchObject({});
    });
  });

  describe('parseExperimentsFromQueryParameters', () => {
    it('should return an Optimize experiment when the query parameter is in the correct format', () => {
      expect(parseExperimentFromQueryParam('.experimentId.variantId')).toMatchObject({ experimentId: 'variantId' });
    });

    it('should return an empty object when the query parameter is not in the correct format', () => {
      expect(parseExperimentFromQueryParam('experimentId.variantId')).toMatchObject({});
    });
  });
});
