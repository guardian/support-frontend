import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StatusResponse } from 'helpers/forms/paymentIntegrations/readerRevenueApis';

// ----- Setup ----- //
const DEFAULT_POLLING_INTERVAL_MILLIS = 3000;
const DEFAULT_MAX_POLLS = 10;

/**
 /**
 * Attempt to submit a payment to the server. The response will be either `success`, `failure` or `pending`.
 * If it is pending, we keep polling until we get either a success or failure response, or we reach the
 * maximum number of retries. Reaching the maximum number of retries is treated as a success, as we assume
 * that the job has been delayed, but will complete successfully in the future and if it doesn't, then the
 * user will be emailed.
 */
export type ProcessPaymentResponse =
	| { status: 'success' }
	| { status: 'pending' }
	| { status: 'failure'; failureReason?: ErrorReason };

export const processPaymentWithRetries = async (
	statusResponse: StatusResponse,
): Promise<ProcessPaymentResponse> => {
	const { trackingUri, status } = statusResponse;
	if (status === 'success' || status === 'failure') {
		return handlePaymentStatus(statusResponse);
	}
	const getTrackingStatus = () =>
		fetch(trackingUri, {
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => response.json() as unknown as StatusResponse);

	return retryPaymentStatus(getTrackingStatus).then((response) =>
		handlePaymentStatus(response),
	);
};

function retryPaymentStatus(
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
			if (result.status === 'pending') {
				if (polls < pollMax) {
					return retryPollAndPromise(polls + 1); // retry on pending
				} else {
					return { status: 'pending', trackingUri: result.trackingUri }; // final pending, exit
				}
			}
			return result; // success or failure, exit
		} catch (error) {
			if (polls < pollMax) {
				return retryPollAndPromise(polls + 1); // promise reject retry
			}
			throw error; // reject, exit
		}
	}
	return retryPollAndPromise(0);
}

const handlePaymentStatus = (
	statusResponse: StatusResponse,
): ProcessPaymentResponse => {
	const { status, failureReason } = statusResponse;
	if (status === 'failure') {
		return { status, failureReason };
	} else {
		return { status: status }; // success or pending
	}
};

function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
