import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

export function AmazonPaymentButton(): JSX.Element {
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
		<DefaultPaymentButtonContainer
			onClick={payWithAmazonPay}
			createButtonText={(amount) => `Pay ${amount} with AmazonPay`}
		/>
	);
}
