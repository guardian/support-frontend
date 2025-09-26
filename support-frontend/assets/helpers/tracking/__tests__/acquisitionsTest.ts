// ----- Imports ----- //
import {
	derivePaymentApiAcquisitionData,
	getOphanIds,
	participationsToAcquisitionABTest,
} from '../acquisitions';

// ----- Tests ----- //
jest.mock('@guardian/ophan-tracker-js/support', () => ({
	viewId: '123456',
}));

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
				abTests: [
					{
						name: 'referrerAbTest',
						variant: 'value1',
					},
				],
				queryParameters: [
					{
						name: 'param1',
						value: 'value1',
					},
					{
						name: 'param2',
						value: 'value2',
					},
				],
			};

			const nativeAbParticipations = {
				testId1: 'variant1',
				testId2: 'variant2',
				testId3: 'variant3',
			};

			const paymentApiAcquisitionData = derivePaymentApiAcquisitionData(
				referrerAcquisitionData,
				nativeAbParticipations,
				'N1 9GU',
			);

			expect(paymentApiAcquisitionData).toMatchSnapshot();

			// The abTests array should be a combination of supportAbTests and the source tests
			expect(paymentApiAcquisitionData.abTests?.length).toEqual(4);

			expect(paymentApiAcquisitionData.campaignCodes?.length).toEqual(1);
		});

		it('should send the postal code', () => {
			const referrerAcquisitionData = {
				campaignCode: 'Example',
				referrerPageviewId: '123456',
				referrerUrl: 'https://example.com',
				componentId: 'exampleComponentId',
				componentType: 'exampleComponentType',
				source: 'exampleSource',
				abTests: [
					{
						name: 'referrerAbTest',
						variant: 'value1',
					},
				],
				queryParameters: [
					{
						name: 'param1',
						value: 'value1',
					},
					{
						name: 'param2',
						value: 'value2',
					},
				],
			};

			const postcode = 'N1 9GU';

			const paymentApiAcquisitionData = derivePaymentApiAcquisitionData(
				referrerAcquisitionData,
				{},
				postcode,
			);

			expect(paymentApiAcquisitionData.postalCode).toBe(postcode);
		});
	});

	describe('getOphanIds', () => {
		it('should return null for the browserId when it is not present in the cookies', () => {
			const { pageviewId, browserId } = getOphanIds();

			expect(pageviewId).toBe('123456');
			expect(browserId).toBeNull();
		});

		it('should read the browserId and pageViewId cookies from ophan', () => {
			document.cookie = 'bwid=123';

			const { pageviewId, browserId } = getOphanIds();

			expect(pageviewId).toBe('123456');
			expect(browserId).toBe('123');
		});
	});

	describe('participationsToAcquisitionABTest', () => {
		it('should return an empty array in the presence of a empty object as its input', () => {
			const participations = {};
			const acquisitionABTest =
				participationsToAcquisitionABTest(participations);

			expect(acquisitionABTest).toEqual([]);
		});

		it('should return an array of AcquisitionAbTests', () => {
			const participations = {
				test0: 'variant0',
				test1: 'variant1',
				test2: 'variant2',
			};

			const acquisitionABTests =
				participationsToAcquisitionABTest(participations);

			expect(acquisitionABTests.length).toEqual(3);
			expect(acquisitionABTests[0]).toEqual({
				name: 'test0',
				variant: 'variant0',
			});
		});
	});
});
