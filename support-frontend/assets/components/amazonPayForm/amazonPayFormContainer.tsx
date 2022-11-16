import { Button } from '@guardian/source-react-components';
import { useAmazonPayObjects } from 'helpers/customHooks/useAmazonPayObjects';
import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { setAmazonPayHasAccessToken } from 'helpers/redux/checkout/payment/amazonPay/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import { paymentWaiting } from 'pages/contributions-landing/contributionsLandingActions';
import AmazonPayForm from './amazonPayForm';

export function AmazonPayFormContainer(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const countryGroupId = useContributionsSelector(
		(state) => state.common.internationalisation.countryGroupId,
	);

	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);

	const contributionType = useContributionsSelector(getContributionType);

	const userInNewProductTest = useContributionsSelector(
		(state) => state.page.user.isTestUser,
	);

	const { loginObject, paymentsObject } = useAmazonPayObjects(
		paymentMethod === AmazonPay,
		countryGroupId,
		userInNewProductTest ? userInNewProductTest : false,
	);

	const hasAccessToken = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.hasAccessToken,
	);

	const amazonPayEnabled = useContributionsSelector(
		(state) => !state.page.checkoutForm.payment.amazonPay.fatalError,
	);

	if (hasAccessToken) {
		dispatch(paymentWaiting(false));
		trackComponentClick('amazon-pay-login-click');
		const loginOptions = {
			scope: 'profile postal_code payments:widget payments:shipping_address',
			popup: true,
		};
		if (loginObject) {
			console.log('amazonPayFormContainer.loginObject.authorize2');
			loginObject.authorize(loginOptions, (response) => {
				if (response.error) {
					logException(`Error from Amazon login: ${response.error}`);
				}
			});
		}
	}

	const loginWithAmazonPay = useFormValidation(function login() {
		console.log('amazonPaymentButton.loginWithAmazonPay');
		dispatch(paymentWaiting(true));
		dispatch(setAmazonPayHasAccessToken());
	});

	return (
		<div className="form__submit">
			{hasAccessToken && amazonPayEnabled && (
				<AmazonPayForm
					amazonLoginObject={loginObject}
					amazonPaymentsObject={paymentsObject}
					isTestUser={userInNewProductTest ? userInNewProductTest : false}
					contributionType={contributionType}
				/>
			)}
			{!hasAccessToken && amazonPayEnabled && (
				<Button
					type="submit"
					aria-label={'Login with AmazonPay'}
					onClick={loginWithAmazonPay}
				>
					{'Login with AmazonPay'}
				</Button>
			)}
		</div>
	);
}
