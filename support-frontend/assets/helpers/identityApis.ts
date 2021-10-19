// ----- Imports ----- //
import { getRequestOptions } from 'helpers/async/fetch';
import { fetchJson } from 'helpers/async/fetch';
import { logPromise } from 'helpers/async/promise';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { checkEmail } from 'helpers/forms/formValidation';
import { routes } from 'helpers/urls/routes';
// ----- Types     ----- //
type UserType = 'new' | 'guest' | 'current';
export type UserTypeFromIdentityResponse =
	| UserType
	| 'noRequestSent'
	| 'requestPending'
	| 'requestFailed';

// ----- Functions ----- //
function sendGetUserTypeFromIdentityRequest(
	email: string,
	csrf: Csrf,
	setUserTypeFromIdentityResponse: (arg0: UserTypeFromIdentityResponse) => void,
): Promise<UserTypeFromIdentityResponse> {
	return fetchJson(
		`${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
		getRequestOptions('same-origin', csrf),
	).then((resp: { userType: UserType }) => {
		if (typeof resp.userType !== 'string') {
			throw new Error('userType string was not present in response');
		}

		setUserTypeFromIdentityResponse(resp.userType);
		return resp.userType;
	});
}

function getUserTypeFromIdentity(
	email: string,
	isSignedIn: boolean,
	csrf: Csrf,
	setUserTypeFromIdentityResponse: (arg0: UserTypeFromIdentityResponse) => void,
): Promise<UserTypeFromIdentityResponse> {
	if (isSignedIn || !checkEmail(email)) {
		setUserTypeFromIdentityResponse('noRequestSent');
		return Promise.resolve('noRequestSent');
	}

	setUserTypeFromIdentityResponse('requestPending');
	return logPromise(
		sendGetUserTypeFromIdentityRequest(
			email,
			csrf,
			setUserTypeFromIdentityResponse,
		),
	).catch(() => {
		setUserTypeFromIdentityResponse('requestFailed');
		return 'requestFailed';
	});
}

export { getUserTypeFromIdentity };
