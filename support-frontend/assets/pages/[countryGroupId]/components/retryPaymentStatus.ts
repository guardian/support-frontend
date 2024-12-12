import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

// ----- Setup ----- //
const DEFAULT_POLLING_INTERVAL_MILLIS = 3000;
const DEFAULT_MAX_POLLS = 10;

// corrects ES5 instanceOf error for retry mechanism
// https://dev.to/dguo/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript-4amp
class StillPendingError extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, StillPendingError.prototype);
	}
}

function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function retryPaymentStatus(
	promiseFunction: () => Promise<StatusResponse>,
	pollMax: number = DEFAULT_MAX_POLLS,
	pollInterval: number = DEFAULT_POLLING_INTERVAL_MILLIS,
	onRetry?: (pollCount: number, pollTimeTotal: number) => void,
): Promise<StatusResponse> {
	async function retryPollAndPromise(polls: number): Promise<StatusResponse> {
		try {
			if (polls > 0) {
				await timeOut(pollInterval); // retry
			}
			const result = await promiseFunction();
			if (result.status === 'pending') {
				throw new StillPendingError('status is pending'); // retry on pending
			}
			return result; // success or failure, exit
		} catch (error) {
			if (polls < pollMax) {
				if (onRetry) {
					onRetry(polls + 1, (polls + 1) * pollInterval); // optional retry notification
				}
				return retryPollAndPromise(polls + 1);
			} else {
				if (error instanceof StillPendingError) {
					return { status: 'pending', trackingUri: '' };
				}
				throw error;
			}
		}
	}
	return retryPollAndPromise(0);
}
