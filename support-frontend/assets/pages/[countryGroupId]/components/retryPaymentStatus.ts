import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

// ----- Setup ----- //
const DEFAULT_POLLING_INTERVAL_MILLIS = 3000;
const DEFAULT_MAX_POLLS = 10;

// corrects ES5 instanceOf error for retry mechanism
// https://dev.to/dguo/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript-4amp
class StillPendingError extends Error {
	constructor(message: string, public trackingUri: string) {
		super(message);
		Object.setPrototypeOf(this, StillPendingError.prototype);
		this.trackingUri = trackingUri;
	}
}

function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function retryPaymentStatus(
	promiseFunction: () => Promise<StatusResponse>,
	pollMax: number = DEFAULT_MAX_POLLS,
	pollInterval: number = DEFAULT_POLLING_INTERVAL_MILLIS,
): Promise<StatusResponse> {
	async function retryPollAndPromiseNew2(
		polls: number,
	): Promise<StatusResponse> {
		try {
			if (polls > 0) {
				await timeOut(pollInterval); // retry
			}
			const result = await promiseFunction();
			if (result.status === 'pending' || result.status === 'failure') {
				if (polls < pollMax - 1) {
					return retryPollAndPromiseNew2(polls + 1); // retry on pending
				} else if (result.status === 'pending') {
					throw new StillPendingError(
						'status finished pending',
						result.trackingUri,
					);
				}
			}
			return result; // success, exit
		} catch (error) {
			if (error instanceof StillPendingError) {
				return { status: 'pending', trackingUri: error.trackingUri };
			} else if (polls < pollMax - 1) {
				return retryPollAndPromiseNew2(polls + 1); // promise reject retry
			}
			throw error;
		}
	}
	return retryPollAndPromiseNew2(0);
}
