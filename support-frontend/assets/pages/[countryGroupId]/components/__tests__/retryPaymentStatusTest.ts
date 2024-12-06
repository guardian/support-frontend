import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { retryPaymentStatus } from '../retryPaymentStatus';

describe('retryPaymentStatus', () => {
	it('returns immediately if the payment is successful', async () => {
		const status: StatusResponse = {
			status: 'success',
			trackingUri: 'https://support/status',
		};
		const getPaymentStatus = jest.fn(() => Promise.resolve(status));

		const result = await retryPaymentStatus(getPaymentStatus, 1, 100);

		expect(result).toEqual(status);
		expect(getPaymentStatus).toHaveBeenCalledTimes(1);
	});

	it('returns immediately if the payment has failed', async () => {
		const status: StatusResponse = {
			status: 'failure',
			trackingUri: 'https://support/status',
			failureReason: 'insufficient_funds',
		};
		const getPaymentStatus = jest.fn(() => Promise.resolve(status));

		const result = await retryPaymentStatus(getPaymentStatus, 1, 100);

		expect(result).toEqual(status);
		expect(getPaymentStatus).toHaveBeenCalledTimes(1);
	});

	it('tries again if the payment is still pending', async () => {
		const initialStatus: StatusResponse = {
			status: 'pending',
			trackingUri: 'https://support/status',
		};
		const finalStatus: StatusResponse = {
			status: 'success',
			trackingUri: 'https://support/status',
		};
		const getPaymentStatus = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve(initialStatus))
			.mockImplementationOnce(() => Promise.resolve(finalStatus));

		const result = await retryPaymentStatus(getPaymentStatus, 2, 100);

		expect(result).toEqual(finalStatus);
		expect(getPaymentStatus).toHaveBeenCalledTimes(2);
	});

	it('pending only', async () => {
		const pendingStatus: StatusResponse = {
			status: 'pending',
			trackingUri: 'https://support/status',
		};
		const finalStatus: StatusResponse = {
			status: 'pending',
			trackingUri: '',
		};
		const getPaymentStatus = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve(pendingStatus));

		const result = await retryPaymentStatus(
			getPaymentStatus,
			2,
			100,
			(pollCount, pollTimeTotal) => {
				console.log(`pending only : attempt ${pollCount}: ${pollTimeTotal}ms`);
			},
		);

		expect(result).toEqual(finalStatus);
		expect(getPaymentStatus).toHaveBeenCalledTimes(1);
	});
});
