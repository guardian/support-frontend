// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import Button from 'components/button/button';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import type { ContributionType, SelectedAmounts } from 'helpers/contributions';
import { billingPeriodFromContrib, getAmount } from 'helpers/contributions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { getContributeButtonCopyWithPaymentType } from 'helpers/forms/checkouts';
import { setupRecurringPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import 'helpers/internationalisation/currency';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { hiddenIf } from 'helpers/utilities/utilities';
import type { AmazonPayData, State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
import { sendFormSubmitEventForPayPalRecurring } from '../contributionsLandingActions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { AmazonPay, PayPal } from 'helpers/forms/paymentMethods';
import AmazonPayLoginButton from 'pages/contributions-landing/components/AmazonPay/AmazonPayLoginButton';
import AmazonPayWallet from './AmazonPay/AmazonPayWallet';
// ----- Types ----- //
type PropTypes = {
	contributionType: ContributionType;
	paymentMethod: PaymentMethod;
	currency: IsoCurrency;
	isWaiting: boolean;
	selectedAmounts: SelectedAmounts;
	otherAmount: string | null;
	currencyId: IsoCurrency;
	csrf: CsrfState;
	sendFormSubmitEventForPayPalRecurring: () => void;
	setupRecurringPayPalPayment: (...args: any[]) => any;
	payPalHasLoaded: boolean;
	isTestUser: boolean;
	onPaymentAuthorisation: (arg0: PaymentAuthorisation) => void;
	formIsSubmittable: boolean;
	amount: number;
	billingPeriod: BillingPeriod;
	amazonPayData: AmazonPayData;
};

function mapStateToProps(state: State) {
	const { contributionType } = state.page.form;
	return {
		currency: state.common.internationalisation.currencyId,
		contributionType,
		isWaiting: state.page.form.isWaiting,
		paymentMethod: state.page.form.paymentMethod,
		selectedAmounts: state.page.form.selectedAmounts,
		otherAmount: state.page.form.formData.otherAmounts[contributionType].amount,
		currencyId: state.common.internationalisation.currencyId,
		csrf: state.page.csrf,
		payPalHasLoaded: state.page.form.payPalData.hasLoaded,
		isTestUser: state.page.user.isTestUser,
		formIsSubmittable: state.page.form.formIsSubmittable,
		amount: getAmount(
			state.page.form.selectedAmounts,
			state.page.form.formData.otherAmounts,
			contributionType,
		),
		billingPeriod: billingPeriodFromContrib(contributionType),
		amazonPayData: state.page.form.amazonPayData,
	};
}

const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
	sendFormSubmitEventForPayPalRecurring: () => {
		dispatch(sendFormSubmitEventForPayPalRecurring());
	},
	setupRecurringPayPalPayment: (
		resolve: (...args: any[]) => any,
		reject: (...args: any[]) => any,
		currencyId: IsoCurrency,
		csrf: CsrfState,
	) => {
		dispatch(setupRecurringPayPalPayment(resolve, reject, currencyId, csrf));
	},
});

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
	);

	const amazonPayEnabled = () => !props.amazonPayData.fatalError;

	const getAmazonPayComponent = () =>
		props.amazonPayData.hasAccessToken ? (
			<AmazonPayWallet
				isTestUser={props.isTestUser}
				contributionType={props.contributionType}
			/>
		) : (
			<AmazonPayLoginButton />
		);

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
			{props.paymentMethod === AmazonPay &&
				amazonPayEnabled() &&
				getAmazonPayComponent()}

			{!showPayPalRecurringButton &&
			(props.paymentMethod !== AmazonPay ||
				(amazonPayEnabled() && props.amazonPayData.hasAccessToken)) ? (
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
