import type { PaymentButtonComponentProps } from 'components/paymentButton/paymentButtonController';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/supporter-plus-landing/setup/legacyActionCreators';

export function ExistingDirectDebitPaymentButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { selectedPaymentMethod } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.existingPaymentMethods,
	);

	const payWithExistingDD = useFormValidation(function pay() {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: 'ExistingDirectDebit',
				billingAccountId: selectedPaymentMethod?.billingAccountId ?? '',
			}),
		);
	});

	return <DefaultButtonContainer onClick={payWithExistingDD} />;
}
