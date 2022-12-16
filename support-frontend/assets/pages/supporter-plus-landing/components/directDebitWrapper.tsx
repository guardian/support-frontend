import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/supporter-plus-landing/setup/legacyActionCreators';

export function DirectDebitContainer(): JSX.Element {
	const dispatch = useContributionsDispatch();

	function onPaymentAuthorisation(paymentAuthorisation: PaymentAuthorisation) {
		dispatch(paymentWaiting(true));
		void dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
	}

	return (
		<DirectDebitPopUpForm
			buttonText="Pay with Direct Debit"
			onPaymentAuthorisation={onPaymentAuthorisation}
		/>
	);
}
