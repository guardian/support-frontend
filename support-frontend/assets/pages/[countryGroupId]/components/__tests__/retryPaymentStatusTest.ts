import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { retryPaymentStatus } from '../retryPaymentStatus';

describe('retryPaymentStatus', () => {
	it('returns immediately if the payment is successful', async () => {
		const status: StatusResponse = {
			status: 'success',
			trackingUri: 'https://support/status',
		};
		const getPaymentStatus = jest.fn(() => Promise.resolve(status));

		const result = await retryPaymentStatus(getPaymentStatus, 0, 1);

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

		const result = await retryPaymentStatus(getPaymentStatus, 0, 1);

		expect(result).toEqual(status);
		expect(getPaymentStatus).toHaveBeenCalledTimes(1);
	});

	it('tries to success when payment is still pending', async () => {
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

		const result = await retryPaymentStatus(getPaymentStatus, 1, 1);

		expect(result).toEqual(finalStatus);
		expect(getPaymentStatus).toHaveBeenCalledTimes(2);
	});

	it('tries to pending when retry limit reached', async () => {
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
			.mockImplementationOnce(() => Promise.resolve(pendingStatus))
			.mockImplementationOnce(() => Promise.resolve(pendingStatus))
			.mockImplementationOnce(() => Promise.resolve(finalStatus));

		const result = await retryPaymentStatus(getPaymentStatus, 2, 1);

		expect(result).toEqual(finalStatus);
		expect(getPaymentStatus).toHaveBeenCalledTimes(3);
	});

	it('retries rejected promises until the retry limit is reached', async () => {
		const getPaymentStatus = jest
			.fn()
			.mockImplementation(() => Promise.reject('error'));

		const fn = () => retryPaymentStatus(getPaymentStatus, 1, 1);

		await expect(fn()).rejects.toMatch('error');
		expect(getPaymentStatus).toHaveBeenCalledTimes(2);
	});

	it('retries rejected promises until it succeeds', async () => {
		const finalStatus: StatusResponse = {
			status: 'success',
			trackingUri: 'https://support/status',
		};
		const getPaymentStatus = jest
			.fn()
			.mockImplementationOnce(() => Promise.reject('error'))
			.mockImplementationOnce(() => Promise.resolve(finalStatus));

		const result = await retryPaymentStatus(getPaymentStatus, 1, 1);

		expect(result).toEqual(finalStatus);
		expect(getPaymentStatus).toHaveBeenCalledTimes(2);
	});
});
