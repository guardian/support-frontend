// ----- Imports ----- //

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Button from 'components/button/button';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import { billingPeriodFromContrib, getAmount } from 'helpers/contributions';
import { getContributeButtonCopyWithPaymentType } from 'helpers/forms/checkouts';
import { setupRecurringPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { AmazonPay, PayPal } from 'helpers/forms/paymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { hiddenIf } from 'helpers/utilities/utilities';
import { sendFormSubmitEventForPayPalRecurring } from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import { AmazonPayCheckout } from './AmazonPay/AmazonPayCheckout';
import { useAmazonPayObjects } from './AmazonPay/useAmazonPayObjects';

// ----- Types ----- //

function mapStateToProps(state: State) {
	const contributionType = getContributionType(state);
	return {
		currency: state.common.internationalisation.currencyId,
		contributionType,
		countryGroupId: state.common.internationalisation.countryGroupId,
		isWaiting: state.page.form.isWaiting,
		paymentMethod: state.page.checkoutForm.payment.paymentMethod,
		selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
		otherAmount:
			state.page.checkoutForm.product.otherAmounts[contributionType].amount,
		currencyId: state.common.internationalisation.currencyId,
		csrf: state.page.checkoutForm.csrf,
		payPalHasLoaded: state.page.checkoutForm.payment.payPal.hasLoaded,
		isTestUser: !!state.page.user.isTestUser,
		formIsSubmittable: state.page.form.formIsSubmittable,
		amount: getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		),
		billingPeriod: billingPeriodFromContrib(contributionType),
		amazonPay: state.page.checkoutForm.payment.amazonPay,
	};
}

const mapDispatchToProps = {
	sendFormSubmitEventForPayPalRecurring,
	setupRecurringPayPalPayment,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	onPaymentAuthorisation: (arg0: PaymentAuthorisation) => void;
	showBenefitsMessaging: boolean;
	userInNewProductTest: boolean;
};

// ----- Render ----- //

function ContributionSubmit(props: PropTypes) {
	// if all payment methods are switched off, do not display the button
	const formClassName = 'form--contribution';
	const showPayPalRecurringButton =
		props.paymentMethod === PayPal && props.contributionType !== 'ONE_OFF';

	const onPayPalCheckoutCompleted = (
		payPalCheckoutDetails: PayPalCheckoutDetails,
	) =>
		props.onPaymentAuthorisation({
			paymentMethod: PayPal,
			token: payPalCheckoutDetails.baid,
		});

	const submitButtonCopy = getContributeButtonCopyWithPaymentType(
		props.contributionType,
		props.otherAmount,
		props.selectedAmounts,
		props.currency,
		props.paymentMethod,
		props.showBenefitsMessaging,
		props.userInNewProductTest,
	);

	const { loginObject, paymentsObject } = useAmazonPayObjects(
		props.paymentMethod === AmazonPay,
		props.countryGroupId,
		props.isTestUser,
	);

	const amazonPayEnabled = () => !props.amazonPay.fatalError;

	// We have to show/hide PayPalExpressButton rather than conditionally rendering it
	// because we don't want to destroy and replace the iframe each time.
	// See PayPalExpressButton for more info.
	return (
		<div className="form__submit">
			{showPayPalRecurringButton && (
				<div
					id="component-paypal-button-checkout"
					className={hiddenIf(
						!showPayPalRecurringButton,
						'component-paypal-button-checkout',
					)}
				>
					<PayPalExpressButton
						onPayPalCheckoutCompleted={onPayPalCheckoutCompleted}
						csrf={props.csrf}
						currencyId={props.currencyId}
						hasLoaded={props.payPalHasLoaded}
						canOpen={() => props.formIsSubmittable}
						onClick={() => props.sendFormSubmitEventForPayPalRecurring()}
						formClassName={formClassName}
						isTestUser={props.isTestUser}
						setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
						amount={props.amount}
						billingPeriod={props.billingPeriod}
					/>
				</div>
			)}

			{props.paymentMethod === AmazonPay && amazonPayEnabled() && (
				<AmazonPayCheckout
					loginObject={loginObject}
					paymentsObject={paymentsObject}
					hasAccessToken={props.amazonPay.hasAccessToken}
					contributionType={props.contributionType}
					isTestUser={props.isTestUser}
				/>
			)}

			{!showPayPalRecurringButton &&
			(props.paymentMethod !== AmazonPay ||
				(amazonPayEnabled() && props.amazonPay.hasAccessToken)) ? (
				<Button
					type="submit"
					aria-label={submitButtonCopy}
					disabled={props.isWaiting}
					postDeploymentTestID="contributions-landing-submit-contribution-button"
				>
					{submitButtonCopy}
				</Button>
			) : null}
		</div>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionSubmit);
