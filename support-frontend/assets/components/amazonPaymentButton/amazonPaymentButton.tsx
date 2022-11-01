import { DefaultPaymentButtonContainer } from 'components/paymentButton/defaultPaymentButtonContainer';
import AnimatedDots from 'components/spinners/animatedDots';
import { useAmazonPayObjects } from 'helpers/customHooks/useAmazonPayObjects';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { setAmazonPayHasAccessToken } from 'helpers/redux/checkout/payment/amazonPay/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';

export function AmazonPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const countryGroupId = useContributionsSelector(
		(state) => state.common.internationalisation.countryGroupId,
	);

	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod,
	);

	const { loginObject, paymentsObject } = useAmazonPayObjects(
		paymentMethod.name === AmazonPay,
		countryGroupId,
		false,
	);

	function pay() {
		trackComponentClick('amazon-pay-login-click');
		const loginOptions = {
			scope: 'profile postal_code payments:widget payments:shipping_address',
			popup: true,
		};
		if (loginObject) {
			loginObject.authorize(loginOptions, (response) => {
				if (response.error) {
					logException(`Error from Amazon login: ${response.error}`);
				} else {
					dispatch(setAmazonPayHasAccessToken());
				}
			});
		}
	}
	if (loginObject && paymentsObject) {
		trackComponentLoad('amazon-pay-login-loaded');
		return <DefaultPaymentButtonContainer onClick={pay} />;
	}
	return <AnimatedDots appearance="dark" />;
}
