import { useEffect } from 'preact/hooks';
import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { setAmazonPayHasAccessToken } from 'helpers/redux/checkout/payment/amazonPay/actions';
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

	const loginWithAmazonPay = useFormValidation(function login() {
		console.log('amazonPaymentButton.loginWithAmazonPay');
		dispatch(setAmazonPayHasAccessToken());
	});

	useEffect(() => {
		dispatch(validateForm('AmazonPay'));
	}, []);

	function payWithAmazonPay() {
		console.log(
			'amazonPaymentButton.payWithAmazonPay.orderReferenceId = ',
			orderReferenceId,
		);
		if (orderReferenceId) {
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
			onClick={hasAccessToken ? payWithAmazonPay : loginWithAmazonPay}
		/>
	);
}
