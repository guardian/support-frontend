// ----- Imports ----- //
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { marketingConsentActionsFor } from './marketingConsentActions';

// ----- Functions ----- //
const requestData = (email: string, csrf: CsrfState) => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Csrf-Token': csrf.token || '',
	},
	credentials: 'same-origin',
	body: JSON.stringify({
		email,
	}),
});

// Fire and forget, as we don't want to interrupt the flow
function sendMarketingPreferencesToIdentity(
	optIn: boolean,
	email: string,
	dispatch: (...args: Array<any>) => any,
	csrf: CsrfState,
	scope: string,
): void {
	const { setConfirmMarketingConsent, setAPIError, setRequestPending } =
		marketingConsentActionsFor(scope);

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
				dispatch(setAPIError(true));
			}
		})
		.catch(() => {
			dispatch(setRequestPending(false));
			logException(
				'Error while trying to interact with the marketing preference API',
			);
			dispatch(setAPIError(true));
		});
}

// ----- Exports ----- //
export { sendMarketingPreferencesToIdentity };
