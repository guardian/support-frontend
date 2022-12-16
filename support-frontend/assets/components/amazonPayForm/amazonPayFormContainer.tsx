import { Button, InlineError } from '@guardian/source-react-components';
import { useAmazonPayObjects } from 'helpers/customHooks/useAmazonPayObjects';
import { AmazonPay } from 'helpers/forms/paymentMethods';
import {
	setAmazonPayBillingAgreementConsentStatus,
	setAmazonPayBillingAgreementId,
	setAmazonPayHasAccessToken,
	setAmazonPayOrderReferenceId,
	setAmazonPayPaymentSelected,
	setAmazonPayWalletIsStale,
} from 'helpers/redux/checkout/payment/amazonPay/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getAmazonPayFormErrors } from 'helpers/redux/selectors/formValidation/paymentValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import { paymentWaiting } from 'pages/supporter-plus-landing/legacyActionCreators';
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
	const amazonPay = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.amazonPay,
	);
	const checkoutFormHasBeenSubmitted = useContributionsSelector(
		(state) => state.page.form.formData.checkoutFormHasBeenSubmitted,
	);

	const errors = useContributionsSelector(getAmazonPayFormErrors);

	function onAmazonPayWalletIsStale(isStale: boolean) {
		dispatch(setAmazonPayWalletIsStale(isStale));
	}
	function onAmazonPayOrderReferenceId(referenceId: string) {
		dispatch(setAmazonPayOrderReferenceId(referenceId));
	}
	function onAmazonPayPaymentSelected(paymentSelected: boolean) {
		dispatch(setAmazonPayPaymentSelected(paymentSelected));
	}
	function onAmazonPayBillingAgreementId(agreementId: string) {
		dispatch(setAmazonPayBillingAgreementId(agreementId));
	}
	function onAmazonPayBillingAgreementConsentStatus(consentStatus: boolean) {
		dispatch(setAmazonPayBillingAgreementConsentStatus(consentStatus));
	}

	const loginWithAmazonPay = function login() {
		dispatch(paymentWaiting(true));
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
			dispatch(paymentWaiting(false));
		}
	};

	return (
		<>
			{hasAccessToken && amazonPayEnabled && (
				<AmazonPayForm
					amazonPay={amazonPay}
					amazonLoginObject={loginObject}
					amazonPaymentsObject={paymentsObject}
					onAmazonPayWalletIsStale={onAmazonPayWalletIsStale}
					onAmazonPayOrderReferenceId={onAmazonPayOrderReferenceId}
					onAmazonPayPaymentSelected={onAmazonPayPaymentSelected}
					onAmazonPayBillingAgreementId={onAmazonPayBillingAgreementId}
					onAmazonPayBillingAgreementConsentStatus={
						onAmazonPayBillingAgreementConsentStatus
					}
					isTestUser={userInNewProductTest ? userInNewProductTest : false}
					contributionType={contributionType}
					checkoutFormHasBeenSubmitted={checkoutFormHasBeenSubmitted}
					errors={errors}
				/>
			)}
			{!hasAccessToken && amazonPayEnabled && (
				<>
					{errors.paymentSelected && (
						<InlineError id="paymentSelected">
							Please click button to proceed
						</InlineError>
					)}
					<Button
						type="submit"
						aria-label={'Proceed with Amazon Pay'}
						onClick={loginWithAmazonPay}
					>
						{'Proceed with Amazon Pay'}
					</Button>
				</>
			)}
		</>
	);
}
