// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import {
	setApiError,
	setConfirmMarketingConsent,
	setRequestPending,
} from 'helpers/redux/checkout/marketingConsent/actions';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';

// ----- Functions ----- //
const requestData = (email: string, csrf: CsrfState) =>
	({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrf.token ?? '',
		},
		credentials: 'same-origin',
		body: JSON.stringify({
			email,
		}),
	} as const);

// Fire and forget, as we don't want to interrupt the flow
function sendMarketingPreferencesToIdentity(
	optIn: boolean,
	email: string,
	dispatch: Dispatch,
	csrf: CsrfState,
): void {
	if (!optIn) {
		dispatch(setConfirmMarketingConsent(false));
		return;
	}

	dispatch(setRequestPending(true));
	fetch(`${routes.contributionsSendMarketing}`, requestData(email, csrf))
		.then((response) => {
			dispatch(setRequestPending(false));

			if (response.status === 200) {
				dispatch(setConfirmMarketingConsent(optIn));
			} else {
				logException('Marketing preference API returned an error');
				dispatch(setApiError(true));
			}
		})
		.catch(() => {
			dispatch(setRequestPending(false));
			logException(
				'Error while trying to interact with the marketing preference API',
			);
			dispatch(setApiError(true));
		});
}

// ----- Exports ----- //
export { sendMarketingPreferencesToIdentity };
