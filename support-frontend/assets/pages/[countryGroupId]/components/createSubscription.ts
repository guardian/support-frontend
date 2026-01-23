import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { RegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { UserType } from '../../../helpers/user/userType';

/**
 * This module contains the logic for creating a subscription or recurring contribution.
 *
 * The mechanism is as follows:
 * - A request is sent to the /subscribe/create endpoint with the details of the subscription to be created.
 * - The server responds with a userType for the current user and a tracking URI we can use to check the current status
 * of the subscription creation process.
 * - The client then polls the tracking URI until the status is either 'success' or 'failure' or the maximum number of
 * retries is reached.
 *
 * Reaching the maximum number of retries is treated as a success, as we assume that the job has been delayed, but
 * will complete successfully in the future and if it doesn't, then the user will be emailed about the failure.
 */
type Status = 'failure' | 'pending' | 'success';

// The final result of a create subscription request.
type CreateSubscriptionResult = {
	userType: UserType | undefined;
	status: Status;
	failureReason?: ErrorReason;
};

// The response returned from the server when we start the subscription creation process.
type StartCreationProcessResponse = CreateSubscriptionResult & {
	trackingUri: string;
};

// The response returned from the server when we poll for the status of the subscription creation process.
type CheckCreationStatusResponse = Omit<
	StartCreationProcessResponse,
	'userType'
>;

const DEFAULT_POLLING_INTERVAL_MILLIS = 3000;
const DEFAULT_MAX_POLLS = 10;

export const createSubscription = async (
	createSupportWorkersRequest: RegularPaymentRequest,
): Promise<CreateSubscriptionResult> => {
	const startCreationResponse = await startSubscriptionCreation(
		createSupportWorkersRequest,
	);
	if (startCreationResponse.status === 'failure') {
		return startCreationResponse;
	}
	return setUpPolling(startCreationResponse);
};

const startSubscriptionCreation = async (
	createSupportWorkersRequest: RegularPaymentRequest,
): Promise<StartCreationProcessResponse> => {
	const response = await fetch('/subscribe/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(createSupportWorkersRequest),
	});
	if (response.ok) {
		return (await response.json()) as StartCreationProcessResponse;
	}
	const errorReason = (await response.text()) as ErrorReason;
	return {
		userType: undefined,
		status: 'failure',
		failureReason: errorReason,
		trackingUri: '',
	};
};

const setUpPolling = async (
	startCreationResponse: StartCreationProcessResponse,
): Promise<CreateSubscriptionResult> => {
	const { userType, trackingUri, status } = startCreationResponse;
	if (status === 'success' || status === 'failure') {
		return startCreationResponse;
	}
	const getCurrentStatus = () =>
		fetch(trackingUri, {
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(
			(response) => response.json() as unknown as CheckCreationStatusResponse,
		);

	const finalResponse = await pollUntilCompleteOrTimeout(getCurrentStatus);
	return {
		userType,
		...finalResponse,
	};
};

export function pollUntilCompleteOrTimeout(
	getCurrentStatusFunction: () => Promise<CheckCreationStatusResponse>,
	pollMax: number = DEFAULT_MAX_POLLS,
	pollInterval: number = DEFAULT_POLLING_INTERVAL_MILLIS,
): Promise<CheckCreationStatusResponse> {
	async function pollIfLessThanMaximumNumberOfTries(
		polls: number,
	): Promise<CheckCreationStatusResponse> {
		try {
			if (polls > 0) {
				await timeOut(pollInterval); // retry
			}
			const result = await getCurrentStatusFunction();
			if (result.status === 'pending') {
				if (polls < pollMax) {
					return pollIfLessThanMaximumNumberOfTries(polls + 1); // retry on pending
				} else {
					return result; // final pending, exit
				}
			}
			return result; // success or failure, exit
		} catch (error) {
			if (polls < pollMax) {
				return pollIfLessThanMaximumNumberOfTries(polls + 1); // promise reject retry
			}
			throw error; // reject, exit
		}
	}
	return pollIfLessThanMaximumNumberOfTries(0);
}

function timeOut(milliseconds: number | undefined): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
