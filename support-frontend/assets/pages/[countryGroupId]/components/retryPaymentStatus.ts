import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

// ----- Setup ----- //
const DEFAULT_POLLING_INTERVAL_MILLIS = 3000;
const DEFAULT_MAX_POLLS = 10;

function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function retryPaymentStatus(
	promiseFunction: () => Promise<StatusResponse>,
	pollMax: number = DEFAULT_MAX_POLLS,
	pollInterval: number = DEFAULT_POLLING_INTERVAL_MILLIS,
): Promise<StatusResponse> {
	async function retryPollAndPromise(polls: number): Promise<StatusResponse> {
		try {
			if (polls > 0) {
				await timeOut(pollInterval); // retry
			}
			const result = await promiseFunction();
			if (result.status === 'pending' || result.status === 'failure') {
				if (polls < pollMax) {
					return retryPollAndPromise(polls + 1); // retry on pending
				} else if (result.status === 'pending') {
					return { status: 'pending', trackingUri: result.trackingUri }; // final pending, exit
				}
			}
			return result; // success or final failure, exit
		} catch (error) {
			if (polls < pollMax) {
				return retryPollAndPromise(polls + 1); // promise reject retry
			}
			throw error; // reject, exit
		}
	}
	return retryPollAndPromise(0);
}
