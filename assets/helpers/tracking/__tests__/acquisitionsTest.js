// @flow

// ----- Imports ----- //

import { type OptimizeExperiments } from '../optimize';

import {
  derivePaymentApiAcquisitionData,
  getOphanIds,
  participationsToAcquisitionABTest,
  optimizeExperimentsToAcquisitionABTest,
} from '../acquisitions';


// ----- Tests ----- //

jest.mock('ophan', () => ({ viewId: '123456' }));

describe('acquisitions', () => {

  describe('derivePaymentApiAcquisitionData', () => {

    it('should return a PaymentAPIAcquisitionData correctly built', () => {
      const referrerAcquisitionData = {
        campaignCode: 'Example',
        referrerPageviewId: '123456',
        referrerUrl: 'https://example.com',
        componentId: 'exampleComponentId',
        componentType: 'exampleComponentType',
        source: 'exampleSource',
        abTests: [{
          name: 'referrerAbTest',
          variant: 'value1',
        }],
        queryParameters: [{ name: 'param1', value: 'value1' }, { name: 'param2', value: 'value2' }],
      };

      const nativeAbParticipations = {
        testId1: 'variant1',
        testId2: 'variant2',
        testId3: 'variant3',
      };

      const optimizeExperiments = {
        optimizeExperiment1: 'variant1',
        optimizeExperiment2: 'variant2',
        optimizeExperiment3: 'variant3',
      };

      const paymentApiAcquisitionData =
        derivePaymentApiAcquisitionData(referrerAcquisitionData, nativeAbParticipations, optimizeExperiments);

      expect(paymentApiAcquisitionData).toMatchSnapshot();

      // The abTests array should be a combination of supportAbTests and the source tests
      expect(paymentApiAcquisitionData.abTests && paymentApiAcquisitionData.abTests.length).toEqual(7);
      expect(paymentApiAcquisitionData.campaignCodes && paymentApiAcquisitionData.campaignCodes.length).toEqual(1);
    });
  });

  describe('getOphanIds', () => {

    it('should return null for the browserId and visitId when they are not present in the cookies', () => {

      const { pageviewId, browserId, visitId } = getOphanIds();

      expect(pageviewId).toBe('123456');
      expect(browserId).toBeNull();
      expect(visitId).toBeNull();
    });

    it('should read the browserId and visitId from cookie and pageViewId from ophan', () => {

      document.cookie = 'bwid=123';
      document.cookie = 'vsid=456';

      const { pageviewId, browserId, visitId } = getOphanIds();

      expect(pageviewId).toBe('123456');
      expect(browserId).toBe('123');
      expect(visitId).toBe('456');
    });
  });

  describe('participationsToAcquisitionABTest', () => {

    it('should return an empty array in the presence of a empty object as its input', () => {
      const participations = {};
      const acquisitionABTest = participationsToAcquisitionABTest(participations);
      expect(acquisitionABTest).toEqual([]);
    });

    it('should return an array of AcquisitionAbTests', () => {
      const participations = {
        test0: 'variant0',
        test1: 'variant1',
        test2: 'variant2',
      };
      const acquisitionABTests = participationsToAcquisitionABTest(participations);

      expect(acquisitionABTests.length).toEqual(3);
      expect(acquisitionABTests[0]).toEqual({ name: 'test0', variant: 'variant0' });
    });
  });

  describe('optimizeExperimentsToAcquisitionABTest', () => {

    it('should return an empty array in the presence of a empty object as its input', () => {
      expect(optimizeExperimentsToAcquisitionABTest({})).toEqual([]);
    });

    it('should return an array of AcquisitionAbTests prepended with an Optimize tag', () => {

      const optimizeExperiments: OptimizeExperiments = {
        testOne: 'variantOne',
        testTwo: 'variantTwo',
        testThree: 'variantSeven',
      };

      const acquisitionABTests = optimizeExperimentsToAcquisitionABTest(optimizeExperiments);

      expect(acquisitionABTests.length).toBe(3);
      expect(acquisitionABTests[0]).toEqual({ name: 'optimize$$testOne', variant: 'variantOne' });

    });

  });
});
