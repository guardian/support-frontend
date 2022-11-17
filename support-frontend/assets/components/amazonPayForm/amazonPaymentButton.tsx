import { useEffect } from 'preact/hooks';
import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/contributions-landing/contributionsLandingActions';

export function AmazonPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const hasAccessToken = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.hasAccessToken,
	);

	const orderReferenceId = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.orderReferenceId,
	);

	useEffect(() => {
		dispatch(validateForm('AmazonPay'));
	}, []);

	function payWithAmazonPay() {
		if (hasAccessToken && orderReferenceId) {
			dispatch(paymentWaiting(true));
			void dispatch(
				onThirdPartyPaymentAuthorised({
					paymentMethod: AmazonPay,
					orderReferenceId: orderReferenceId,
				}),
			);
		}
	}

	trackComponentLoad('amazon-pay-login-loaded');
	return (
		<DefaultPaymentButtonContainer
			onClick={payWithAmazonPay}
			createButtonText={(amount) => `Pay ${amount} with AmazonPay`}
		/>
	);
}
