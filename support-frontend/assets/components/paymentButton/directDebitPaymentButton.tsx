import { useDirectDebitValidation } from 'helpers/customHooks/useFormValidation';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { payWithDirectDebit } from 'helpers/redux/checkout/payment/directDebit/thunks';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/supporter-plus-landing/setup/legacyActionCreators';
import type { PaymentButtonComponentProps } from './paymentButtonController';

export function DirectDebitPaymentButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	function onSubmit() {
		void dispatch(
			payWithDirectDebit((paymentAuthorisation: PaymentAuthorisation) => {
				void dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation));
			}),
		);
	}

	const onClick = useDirectDebitValidation(onSubmit);

	return <DefaultButtonContainer onClick={onClick} />;
}
