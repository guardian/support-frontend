import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { setAmazonPayHasAccessToken } from 'helpers/redux/checkout/payment/amazonPay/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';

export function AmazonPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const hasAccessToken = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.hasAccessToken,
	);

	const loginWithAmazonPay = useFormValidation(function login() {
		console.log('amazonPaymentButton.loginWithAmazonPay');
		dispatch(setAmazonPayHasAccessToken());
	});

	function payWithAmazonPay() {
		console.log('amazonPaymentButton.payWithAmazonPay');
	}

	trackComponentLoad('amazon-pay-login-loaded');
	return (
		<DefaultPaymentButtonContainer
			onClick={hasAccessToken ? payWithAmazonPay : loginWithAmazonPay}
		/>
	);
}
