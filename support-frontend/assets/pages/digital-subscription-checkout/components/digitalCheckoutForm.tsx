// ----- Imports ----- //
import { useEffect } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import type { CsrCustomerData } from 'components/csr/csrMode';
import { useCsrCustomerData } from 'components/csr/csrMode';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import { BillingAddress } from 'components/subscriptionCheckouts/address/scopedAddressFields';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import CheckoutLayout, {
	Content,
} from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { countries } from 'helpers/internationalisation/country';
import { userIsPatron } from 'helpers/patrons';
import type { DigitalBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import {
	selectDiscountedPrice,
	selectPriceForProduct,
} from 'helpers/redux/checkout/product/selectors/productPrice';
import { getSubscriptionType } from 'helpers/redux/checkout/product/selectors/productType';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import {
	formActionCreators,
	setCsrCustomerData,
} from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import {
	checkoutFormIsValid,
	validateCheckoutForm,
} from 'helpers/subscriptionsForms/formValidation';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import {
	submitCheckoutForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/supportedPaymentMethods';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { sendEventSubscriptionCheckoutStart } from 'helpers/tracking/quantumMetric';
import { routes } from 'helpers/urls/routes';
import { signOut } from 'helpers/user/user';
import EndSummaryMobile from 'pages/digital-subscription-checkout/components/endSummary/endSummaryMobile';
import OrderSummary from 'pages/digital-subscription-checkout/components/orderSummary/orderSummary';

// ----- Map State/Props ----- //
function mapStateToProps(state: SubscriptionsState) {
	return {
		...getFormFields(state),
		country: state.common.internationalisation.countryId,
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		currencyId: state.common.internationalisation.currencyId,
		csrf: state.page.checkoutForm.csrf,
		payPalHasLoaded: state.page.checkoutForm.payment.payPal.hasLoaded,
		paymentMethod: state.page.checkoutForm.payment.paymentMethod.name,
		isTestUser: state.page.checkout.isTestUser,
		billingPeriod: state.page.checkoutForm.product
			.billingPeriod as DigitalBillingPeriod,
		addressErrors: state.page.checkoutForm.billingAddress.fields.errors,
		participations: state.common.abParticipations,
		product: getSubscriptionType(state),
		price: selectPriceForProduct(state),
		discountedPrice: selectDiscountedPrice(state),
	};
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
	return {
		...formActionCreators,
		fetchAndStoreUserType:
			(email: string) =>
			(dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) => {
				fetchAndStoreUserType(email)(dispatch, getState);
			},
		formIsValid:
			() =>
			(_dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) =>
				checkoutFormIsValid(getState()),
		submitForm:
			() =>
			(dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) =>
				submitCheckoutForm(dispatch, getState()),
		validateForm:
			() =>
			(dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) => {
				const state = getState();
				validateCheckoutForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkoutForm.payment;

				if (paymentMethod.name === PayPal) {
					trackSubmitAttempt(PayPal, DigitalPack, NoProductOptions);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
		signOut,
		setCsrCustomerData: (customerData: CsrCustomerData) =>
			setCsrCustomerData('billing', customerData),
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

type PropTypes = ConnectedProps<typeof connector>;

// ----- Component ----- //
function DigitalCheckoutForm(props: PropTypes) {
	useCsrCustomerData(props.setCsrCustomerData);

	useEffect(() => {
		sendEventSubscriptionCheckoutStart(
			props.product,
			false,
			props.price,
			props.billingPeriod,
		);
	}, []);

	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';

	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.country,
	);

	const isPatron = userIsPatron(props.price.promotions);

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
						productPrice={props.price}
						billingPeriod={props.billingPeriod}
						changeSubscription={routes.digitalSubscriptionLanding}
						isPatron={isPatron}
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
						<BillingAddress countries={countries} />
					</FormSection>
					{paymentMethods.length > 0 ? (
						<FormSection
							title={
								paymentMethods.length > 1
									? 'How would you like to pay?'
									: 'Payment Method'
							}
						>
							<PaymentMethodSelector
								availablePaymentMethods={paymentMethods}
								paymentMethod={props.paymentMethod}
								setPaymentMethod={props.setPaymentMethod}
								validationError={firstError('paymentMethod', props.formErrors)}
							/>
						</FormSection>
					) : (
						<GeneralErrorMessage
							classModifiers={['no-valid-payments']}
							errorHeading="Payment methods are unavailable"
							errorReason="all_payment_methods_unavailable"
						/>
					)}
					<FormSectionHiddenUntilSelected
						id="stripeForm"
						show={props.paymentMethod === Stripe}
						title="Your card details"
					>
						<StripeProviderForCountry
							country={props.country}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							//  @ts-expect-error -- TODO: fix error types!!
							allErrors={[...props.addressErrors, ...props.formErrors]}
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
							amount={props.discountedPrice.price}
							billingPeriod={props.billingPeriod}
							//  @ts-expect-error -- TODO: fix error types!!
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
}

// ----- Exports ----- //

export default connector(DigitalCheckoutForm);
