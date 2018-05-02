// @flow

// ----- Imports ----- //

import {
  derivePaymentApiAcquisitionData,
} from '../acquisitions';

// ----- Tests ----- //

jest.mock('ophan', () => {});

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
        abTest: {
          name: 'referrerAbTest',
          variant: 'value1',
        },
        abTests: [],
        queryParameters: [{ name: 'param1', value: 'value1' }, { name: 'param2', value: 'value2' }],
      };

      const nativeAbParticipations = {
        testId1: 'variant1',
        testId2: 'variant2',
        testId3: 'variant3',
      };

      const paymentApiAcquisitionData =
        derivePaymentApiAcquisitionData(referrerAcquisitionData, nativeAbParticipations);

      expect(paymentApiAcquisitionData).toMatchSnapshot();

      // The abTests array should be a combination of supportAbTests and the source tests
      expect(paymentApiAcquisitionData.abTests.length).toEqual(4);
      expect(paymentApiAcquisitionData.campaignCodes.length).toEqual(1);
    });
  });
});
