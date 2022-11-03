import { Button } from '@guardian/source-react-components';
import { useAmazonPayObjects } from 'helpers/customHooks/useAmazonPayObjects';
import { getContributeButtonCopyWithPaymentType } from 'helpers/forms/checkouts';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import AmazonPayForm from './amazonPayForm';

type PropTypes = {
	showBenefitsMessaging: boolean;
	userInNewProductTest: boolean;
};

export function AmazonPayFormContainer(props: PropTypes): JSX.Element {
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

	const otherAmount = useContributionsSelector(
		(state) =>
			state.page.checkoutForm.product.otherAmounts[contributionType].amount,
	);

	const selectedAmounts = useContributionsSelector(
		(state) => state.page.checkoutForm.product.selectedAmounts,
	);

	const currency = useContributionsSelector(
		(state) => state.common.internationalisation.currencyId,
	);

	const submitButtonCopy = getContributeButtonCopyWithPaymentType(
		contributionType,
		otherAmount,
		selectedAmounts,
		currency,
		paymentMethod,
		props.showBenefitsMessaging,
		props.userInNewProductTest,
	);

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
			{hasAccessToken && amazonPayEnabled && (
				<Button type="submit" aria-label={submitButtonCopy}>
					{submitButtonCopy}
				</Button>
			)}
		</div>
	);
}
