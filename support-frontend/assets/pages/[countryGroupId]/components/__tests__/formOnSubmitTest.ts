import { onConsent } from '@guardian/consent-manager';
import getConsentValue from '../../helpers/getConsentValue';
import { createSubscription } from '../createSubscription';
import { submitForm } from '../formOnSubmit';

jest.mock('@guardian/consent-manager', () => ({
	cmp: { version: 'test-version' },
	onConsent: jest.fn(),
}));

jest.mock('helpers/tracking/acquisitions', () => ({
	getOphanIds: jest.fn(() => ({ pageviewId: 'page-view' })),
	getReferrerAcquisitionData: jest.fn(() => ({ source: 'checkout' })),
	getSupportAbTests: jest.fn(() => []),
}));

jest.mock('../../checkout/helpers/deliveryDays', () => ({
	getProductFirstDeliveryDate: jest.fn(() => null),
}));

jest.mock('../../checkout/helpers/formDataExtractors', () => ({
	extractPersonalDataFromForm: jest.fn(() => ({
		firstName: 'Ada',
		lastName: 'Lovelace',
		email: 'ada@example.com',
	})),
	extractGiftRecipientDataFromForm: jest.fn(() => undefined),
	extractDeliverableAddressDataFromForm: jest.fn(() => ({
		billingAddress: { country: 'GB' },
		deliveryAddress: { country: 'GB' },
	})),
	extractNonDeliverableAddressDataFromForm: jest.fn(() => ({
		billingAddress: { country: 'GB' },
		deliveryAddress: undefined,
	})),
}));

jest.mock('../../checkout/helpers/productInformation', () => ({
	buildProductInformation: jest.fn(() => undefined),
}));

jest.mock('../../checkout/helpers/sessionStorage', () => ({
	setThankYouOrder: jest.fn(),
}));

jest.mock('../../checkout/helpers/stripe', () => ({
	stripeCreateCheckoutSession: jest.fn(),
}));

jest.mock('../../checkout/helpers/stripeCheckoutSession', () => ({
	deleteFormDetails: jest.fn(),
	persistFormDetails: jest.fn(),
}));

jest.mock('../../helpers/getConsentValue', () => ({
	__esModule: true,
	default: jest.fn(() => true),
}));

jest.mock('../createSubscription', () => ({
	createSubscription: jest.fn(),
}));

const mockOnConsent = jest.mocked(onConsent);
const mockCreateSubscription = jest.mocked(createSubscription);
const mockGetConsentValue = jest.mocked(getConsentValue);

const submitDirectDebitForm = () => {
	const formData = { get: jest.fn(() => null) } as unknown as FormData;
	return submitForm({
		supportRegionId: 'uk',
		productKey: 'Contribution',
		ratePlanKey: 'Monthly',
		formData,
		paymentMethod: 'DirectDebit',
		paymentFields: {
			paymentType: 'DirectDebit',
			accountHolderName: 'Ada Lovelace',
			sortCode: '200000',
			accountNumber: '12345678',
		},
		productFields: {
			productType: 'Contribution',
			amount: 5,
			currency: 'GBP',
			billingPeriod: 'Monthly',
		},
		hasDeliveryAddress: false,
		abParticipations: {},
		promotion: undefined,
		contributionAmount: 5,
		taxRateConfig: {},
	} as unknown as Parameters<typeof submitForm>[0]);
};

describe('submitForm CMP consent request data', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('uses the current consent state and preserves existing conversion fields', async () => {
		let currentState = {
			framework: 'usnat' as const,
			canTarget: true,
			usnat: { doNotSell: false, signalStatus: 'ready' as const },
		};
		mockOnConsent.mockImplementation(() => Promise.resolve(currentState));
		mockCreateSubscription.mockRejectedValue(new Error('stop after request'));

		// Simulate the user changing consent before submitting the form.
		currentState = {
			framework: 'usnat',
			canTarget: false,
			usnat: { doNotSell: true, signalStatus: 'ready' },
		};

		const submission = submitDirectDebitForm();

		await expect(submission).rejects.toThrow('stop after request');

		expect(mockOnConsent).toHaveBeenCalledTimes(1);
		const conversionRequest = mockCreateSubscription.mock.calls[0]?.[0];
		expect(conversionRequest).toMatchObject({
			firstName: 'Ada',
			lastName: 'Lovelace',
			similarProductsConsent: true,
			cmpConsentSnapshot: {
				framework: 'usnat',
				usnat: { doNotSell: true, signalStatus: 'ready' },
			},
		});
		expect(mockGetConsentValue).toHaveBeenCalled();
	});

	it('continues conversion submission with a null snapshot when the consent read fails', async () => {
		mockOnConsent.mockRejectedValue(new Error('consent unavailable'));
		mockCreateSubscription.mockRejectedValue(new Error('stop after request'));

		await expect(submitDirectDebitForm()).rejects.toThrow('stop after request');

		expect(mockCreateSubscription).toHaveBeenCalledWith(
			expect.objectContaining({ cmpConsentSnapshot: null }),
		);
	});

	it('continues conversion submission with a null snapshot after a consent read timeout', async () => {
		jest.useFakeTimers();
		mockOnConsent.mockReturnValue(new Promise(() => undefined));
		mockCreateSubscription.mockRejectedValue(new Error('stop after request'));

		const submission = submitDirectDebitForm();
		const submissionExpectation =
			expect(submission).rejects.toThrow('stop after request');
		await jest.advanceTimersByTimeAsync(1000);

		await submissionExpectation;
		expect(mockCreateSubscription).toHaveBeenCalledWith(
			expect.objectContaining({ cmpConsentSnapshot: null }),
		);
	});
});
