import { useAmazonPayObjects } from 'helpers/customHooks/useAmazonPayObjects';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import AmazonPayForm from './amazonPayForm';

export function AmazonPayFormContainer(): JSX.Element {
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

	console.log(
		'amazonPayFormContainer.paymentMethod,countryGroupId,isTestUser',
		paymentMethod,
		countryGroupId,
		false,
	);
	const { loginObject, paymentsObject } = useAmazonPayObjects(
		paymentMethod === AmazonPay,
		countryGroupId,
		false,
	);
	console.log('amazonPayFormContainer.loginObject', loginObject);
	const hasAccessToken = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay.hasAccessToken,
	);

	return hasAccessToken ? (
		<>
			<div>ShowAmazonPayCard</div>
			<AmazonPayForm
				amazonLoginObject={loginObject}
				amazonPaymentsObject={paymentsObject}
				isTestUser={userInNewProductTest ? userInNewProductTest : false}
				contributionType={contributionType}
			/>
		</>
	) : (
		<div>HideAmazonPayCard</div>
	);
}
