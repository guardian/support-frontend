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
	pollMax: number = MAX_POLLS,
	pollInterval: number = POLLING_INTERVAL,
	onRetry?: (pollCount: number, pollTimeTotal: number) => void,
): Promise<StatusResponse> {
	async function retryPollAndPromise(polls: number): Promise<StatusResponse> {
		try {
			if (polls > 0) {
				console.log(`poll ${polls} await timeOut`);
				await timeOut(pollInterval); // retry
			}
			console.log(`poll ${polls} await promiseFunction`);
			const result = await promiseFunction();
			if (result.status === 'pending') {
				throw new Error('status is pending');
			}
			return result; // success or failure, exit
		} catch (error) {
			if (polls < pollMax) {
				if (onRetry) {
					onRetry(polls + 1, (polls + 1) * pollInterval); // optional retry notification
				}
				console.log(`error retry poll ${polls + 1} retryPollAndPromise`);
				return retryPollAndPromise(polls + 1);
			} else {
				if (error instanceof StillPendingError) {
					console.log(`error return pending`);
					return { status: 'pending', trackingUri: '' };
				}
				console.log(`throw other error (not pending))`);
				throw error;
			}
		}
	}
	return retryPollAndPromise(0);
}
