import type { PaymentButtonComponentProps } from 'components/paymentButton/paymentButtonController';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { onThirdPartyPaymentAuthorised } from 'pages/supporter-plus-landing/setup/legacyActionCreators';

export function AmazonPaymentButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const hasAccessToken = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.hasAccessToken,
	);

	const orderReferenceId = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.orderReferenceId,
	);

	const payWithAmazonPay = useFormValidation(function amazonPayPayment() {
		if (hasAccessToken && orderReferenceId) {
			void dispatch(
				onThirdPartyPaymentAuthorised({
					paymentMethod: AmazonPay,
					orderReferenceId: orderReferenceId,
				}),
			);
		}
	});

	trackComponentLoad('amazon-pay-login-loaded');
	return (
		<DefaultButtonContainer
			onClick={payWithAmazonPay}
			createButtonText={(amount) => `Pay ${amount} with Amazon Pay`}
		/>
	);
}
