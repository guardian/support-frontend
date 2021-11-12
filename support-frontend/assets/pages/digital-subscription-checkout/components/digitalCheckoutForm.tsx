// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import CheckoutLayout, {
	Content,
} from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { countries } from 'helpers/internationalisation/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { DigitalBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import type {
	Action,
	FormActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type {
	FormField,
	FormFields,
} from 'helpers/subscriptionsForms/formFields';
import {
	checkoutFormIsValid,
	validateCheckoutForm,
} from 'helpers/subscriptionsForms/formValidation';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import {
	submitCheckoutForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { getBillingAddress } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { routes } from 'helpers/urls/routes';
import { signOut } from 'helpers/user/user';
import EndSummaryMobile from 'pages/digital-subscription-checkout/components/endSummary/endSummaryMobile';
import OrderSummary, {
	isPatron,
} from 'pages/digital-subscription-checkout/components/orderSummary/orderSummary';
// ----- Types ----- //
type PropTypes = FormFields &
	FormActionCreators & {
		country: IsoCountry;
		signOut: typeof signOut;
		submitForm: (...args: any[]) => any;
		formErrors: Array<FormError<FormField>>;
		submissionError: ErrorReason | null;
		productPrices: ProductPrices;
		currencyId: IsoCurrency;
		fetchAndStoreUserType: (...args: any[]) => any;
		csrf: Csrf;
		payPalHasLoaded: boolean;
		isTestUser: boolean;
		amount: number;
		billingPeriod: DigitalBillingPeriod;
		setupRecurringPayPalPayment: (...args: any[]) => any;
		validateForm: () => (...args: any[]) => any;
		formIsValid: (...args: any[]) => any;
		addressErrors: Array<Record<string, any>>;
		// eslint-disable-next-line react/no-unused-prop-types
		participations: Participations;
	};

// ----- Map State/Props ----- //
function mapStateToProps(state: CheckoutState) {
	return {
		...getFormFields(state),
		country: state.common.internationalisation.countryId,
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkout.productPrices,
		currencyId: state.common.internationalisation.currencyId,
		csrf: state.page.csrf,
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
		paymentMethod: state.page.checkout.paymentMethod,
		isTestUser: state.page.checkout.isTestUser,
		amount: finalPrice(
			state.page.checkout.productPrices,
			state.common.internationalisation.countryId,
			state.page.checkout.billingPeriod,
		).price,
		billingPeriod: state.page.checkout.billingPeriod,
		addressErrors: state.page.billingAddress.fields.formErrors,
		participations: state.common.abParticipations,
	};
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
	return {
		...formActionCreators,
		fetchAndStoreUserType:
			(email) =>
			(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
				fetchAndStoreUserType(email)(dispatch, getState);
			},
		formIsValid:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
				checkoutFormIsValid(getState()),
		submitForm:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
				submitCheckoutForm(dispatch, getState()),
		validateForm:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
				const state = getState();
				validateCheckoutForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkout;

				if (paymentMethod === PayPal) {
					trackSubmitAttempt(PayPal, DigitalPack, NoProductOptions);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
		signOut,
	};
}

const Address = withStore(countries, 'billing', getBillingAddress);

// ----- Component ----- //
function DigitalCheckoutForm(props: PropTypes) {
	const productPrice = getProductPrice(
		props.productPrices,
		props.country,
		props.billingPeriod,
	);
	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';
	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.country,
	);

	return (
		<Content>
			<CheckoutLayout
				aside={
					<OrderSummary
						image={
							<GridImage
								gridId={
									props.country === 'AU'
										? 'editionsPackshotAusShort'
										: 'editionsPackshotShort'
								}
								srcSizes={[1000, 500]}
								sizes="(max-width: 740px) 50vw, 500"
								imgType="png"
								altText=""
							/>
						}
						title="Digital Subscription"
						description="Premium App + The Guardian Daily + Ad-free"
						productPrice={productPrice}
						billingPeriod={props.billingPeriod}
						changeSubscription={routes.digitalSubscriptionLanding}
					/>
				}
			>
				<Form
					onSubmit={(ev) => {
						ev.preventDefault();
						props.submitForm();
					}}
				>
					<FormSection title="Your details">
						<PersonalDetails
							firstName={props.firstName}
							setFirstName={props.setFirstName}
							lastName={props.lastName}
							setLastName={props.setLastName}
							email={props.email}
							setEmail={props.setEmail}
							confirmEmail={props.confirmEmail}
							setConfirmEmail={props.setConfirmEmail}
							isSignedIn={props.isSignedIn}
							fetchAndStoreUserType={props.fetchAndStoreUserType}
							telephone={props.telephone}
							setTelephone={props.setTelephone}
							formErrors={props.formErrors}
							signOut={props.signOut}
						/>
					</FormSection>
					<FormSection title="Address">
						<Address />
					</FormSection>
					{paymentMethods.length > 1 ? (
						<FormSection title="How would you like to pay?">
							<PaymentMethodSelector
								availablePaymentMethods={paymentMethods}
								paymentMethod={props.paymentMethod}
								setPaymentMethod={props.setPaymentMethod}
								validationError={firstError('paymentMethod', props.formErrors)}
							/>
						</FormSection>
					) : null}
					<FormSectionHiddenUntilSelected
						id="stripeForm"
						show={props.paymentMethod === Stripe}
						title="Your card details"
					>
						<StripeProviderForCountry
							country={props.country}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							allErrors={[...props.addressErrors, ...props.formErrors]}
							setStripePaymentMethod={props.setStripePaymentMethod}
							validateForm={props.validateForm}
							buttonText={isPatron ? 'Continue' : 'Start your free trial now'}
							csrf={props.csrf}
						/>
					</FormSectionHiddenUntilSelected>
					<FormSectionHiddenUntilSelected
						id="directDebitForm"
						show={props.paymentMethod === DirectDebit}
						title="Your account details"
					>
						<DirectDebitForm
							buttonText="Start free trial"
							submitForm={props.submitForm}
							allErrors={[...props.addressErrors, ...props.formErrors]}
							submissionError={props.submissionError}
							submissionErrorHeading={submissionErrorHeading}
						/>
					</FormSectionHiddenUntilSelected>
					{props.paymentMethod === PayPal ? (
						<PayPalSubmitButton
							paymentMethod={props.paymentMethod}
							onPaymentAuthorised={props.onPaymentAuthorised}
							csrf={props.csrf}
							currencyId={props.currencyId}
							payPalHasLoaded={props.payPalHasLoaded}
							formIsValid={props.formIsValid}
							validateForm={props.validateForm}
							isTestUser={props.isTestUser}
							setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
							amount={props.amount}
							billingPeriod={props.billingPeriod}
							allErrors={[...props.addressErrors, ...props.formErrors]}
						/>
					) : null}
					<GeneralErrorMessage
						errorReason={props.submissionError}
						errorHeading={submissionErrorHeading}
					/>
					<EndSummaryMobile />
					<DirectDebitPaymentTerms paymentMethod={props.paymentMethod} />
				</Form>
			</CheckoutLayout>
		</Content>
	);
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(DigitalCheckoutForm);
