import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

// ----- Setup ----- //
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;
class StillPendingError extends Error {}

// retry mechanism for polling based upon
// https://bpaulino.com/entries/retrying-api-calls-with-exponential-backoff
function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function retryPaymentStatus(
	promiseFunction: () => Promise<StatusResponse>,
	onRetry?: (pollCount: number, pollTimeTotal: number) => void,
): Promise<StatusResponse> {
	async function retryPollAndPromise(polls: number): Promise<StatusResponse> {
		try {
			if (polls > 0) {
				await timeOut(POLLING_INTERVAL); // retry
			}
			const result = await promiseFunction();
			if (result.status === 'pending') {
				throw new Error('status is pending');
			}
			return result; // success or failure, exit
		} catch (error) {
			if (polls < MAX_POLLS) {
				if (onRetry) {
					onRetry(polls + 1, (polls + 1) * POLLING_INTERVAL); // optional retry notification
				}
				return retryPollAndPromise(polls + 1);
			} else {
				if (error instanceof StillPendingError) {
					return { status: 'pending', trackingUri: '' };
				}
				throw error; // poll limit reached
			}
		}
	}
	return retryPollAndPromise(0);
}
