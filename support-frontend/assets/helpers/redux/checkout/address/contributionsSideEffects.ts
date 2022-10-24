import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import { setBillingState } from './actions';

export function addAddressSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		actionCreator: setBillingState,
		effect(_action, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
