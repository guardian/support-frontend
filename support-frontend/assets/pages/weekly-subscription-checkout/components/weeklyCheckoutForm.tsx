// ----- Imports ----- //
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import 'redux';
import { Radio, RadioGroup } from '@guardian/src-radio';
import Rows from 'components/base/rows';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import GridImage from 'components/gridImage/gridImage';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import type { SetCountryChangedAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { addressActionCreatorsFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { BillingPeriodSelector } from 'components/subscriptionCheckouts/billingPeriodSelector';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import PaymentTerms from 'components/subscriptionCheckouts/paymentTerms';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import Summary from 'components/subscriptionCheckouts/summary';
import Text from 'components/text/text';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countries } from 'helpers/internationalisation/country';
import { weeklyDeliverableCountries } from 'helpers/internationalisation/weeklyDeliverableCountries';
import { weeklyBillingPeriods } from 'helpers/productPrice/billingPeriods';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import type {
	Action,
	FormActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import type {
	FormField,
	FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	getBillingAddress,
	getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { routes } from 'helpers/urls/routes';
import { signOut } from 'helpers/user/user';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import type { SetCountryAction } from 'helpers/page/commonActions';
import 'helpers/page/commonActions';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import {
	validateWithDeliveryForm,
	withDeliveryFormIsValid,
} from 'helpers/subscriptionsForms/formValidation';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import Total from 'components/subscriptionCheckouts/total/total';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { titles } from 'helpers/user/details';
import { Option as OptionForSelect, Select } from '@guardian/src-select';
import { options } from 'components/forms/customFields/options';
import { currencyFromCountryCode } from 'helpers/internationalisation/currency';
import type { Participations } from 'helpers/abTests/abtest';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormError } from 'helpers/subscriptionsForms/validation';
// ----- Styles ----- //
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;
// ----- Types ----- //
type PropTypes = FormFields &
	FormActionCreators & {
		// eslint-disable-next-line react/no-unused-prop-types
		billingCountry: IsoCountry;
		deliveryCountry: IsoCountry;
		signOut: typeof signOut;
		formErrors: Array<FormError<FormField>>;
		submissionError: ErrorReason | null;
		productPrices: ProductPrices;
		fetchAndStoreUserType: (...args: any[]) => any;
		submitForm: (...args: any[]) => any;
		setBillingCountry: (...args: any[]) => any;
		billingAddressErrors: Array<Record<string, any>>;
		deliveryAddressErrors: Array<Record<string, any>>;
		isTestUser: boolean;
		validateForm: () => (...args: any[]) => any;
		csrf: Csrf;
		currencyId: IsoCurrency;
		payPalHasLoaded: boolean;
		formIsValid: (...args: any[]) => any;
		setupRecurringPayPalPayment: (...args: any[]) => any;
		participations: Participations;
	};

// ----- Map State/Props ----- //
function mapStateToProps(state: WithDeliveryCheckoutState) {
	const { billingAddress, deliveryAddress } = state.page;
	const { billingAddressIsSame } = state.page.checkout;
	return {
		...getFormFields(state),
		billingCountry: billingAddressIsSame
			? deliveryAddress.fields.country
			: billingAddress.fields.country,
		deliveryCountry: deliveryAddress.fields.country,
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkout.productPrices,
		deliveryAddressErrors: state.page.deliveryAddress.fields.formErrors,
		billingAddressErrors: state.page.billingAddress.fields.formErrors,
		isTestUser: state.page.checkout.isTestUser,
		csrf: state.page.csrf,
		currencyId: currencyFromCountryCode(deliveryAddress.fields.country),
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
		participations: state.common.abParticipations,
	};
}

function mapDispatchToProps() {
	const { setCountry } = addressActionCreatorsFor('billing');
	return {
		...formActionCreators,
		fetchAndStoreUserType:
			(email) =>
			(
				dispatch: Dispatch<Action>,
				getState: () => WithDeliveryCheckoutState,
			) => {
				fetchAndStoreUserType(email)(dispatch, getState);
			},
		formIsValid:
			() =>
			(dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
				withDeliveryFormIsValid(getState()),
		submitForm:
			() =>
			(dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
				submitWithDeliveryForm(dispatch, getState()),
		signOut,
		setBillingCountry:
			(country) =>
			(dispatch: Dispatch<SetCountryChangedAction | SetCountryAction>) =>
				setCountry(country)(dispatch),
		validateForm:
			() =>
			(
				dispatch: Dispatch<Action>,
				getState: () => WithDeliveryCheckoutState,
			) => {
				const state = getState();
				validateWithDeliveryForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkout;

				if (paymentMethod === PayPal) {
					trackSubmitAttempt(PayPal, GuardianWeekly, NoProductOptions);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
	};
}

// ----- Form Fields ----- //
const DeliveryAddress = withStore(
	weeklyDeliverableCountries,
	'delivery',
	getDeliveryAddress,
);
const BillingAddress = withStore(countries, 'billing', getBillingAddress);
const days = getWeeklyDays();

// ----- Component ----- //
function WeeklyCheckoutForm(props: PropTypes) {
	const fulfilmentOption = getWeeklyFulfilmentOption(props.deliveryCountry);
	const price = getProductPrice(
		props.productPrices,
		props.deliveryCountry,
		props.billingPeriod,
		fulfilmentOption,
	);
	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';

	const setBillingAddressIsSameHandler = (newState) => {
		props.setBillingAddressIsSame(newState);
		props.setBillingCountry(props.deliveryCountry);
	};

	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.billingCountry,
	);
	return (
		<Content modifierClasses={['your-details']}>
			<Layout
				aside={
					<Summary
						image={
							<GridImage
								gridId="checkoutPackshotWeekly"
								srcSizes={[548, 500]}
								sizes="(max-width: 740px) 50vw, 548"
								imgType="png"
								altText=""
							/>
						}
						title="Guardian Weekly"
						description=""
						productPrice={price}
						billingPeriod={props.billingPeriod}
						changeSubscription={routes.guardianWeeklySubscriptionLanding}
						product={props.product}
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
						<Select
							css={marginBottom}
							id="title"
							label="Title"
							optional
							value={props.title}
							onChange={(e) => props.setTitle(e.target.value)}
						>
							<OptionForSelect>Select a title</OptionForSelect>
							{options(titles)}
						</Select>
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
					<FormSection title="Where should we deliver your magazine?">
						<DeliveryAddress />
					</FormSection>
					<FormSection title="Is the billing address the same as the delivery address?">
						<Rows>
							<RadioGroup
								label="Is the billing address the same as the delivery address?"
								hideLabel
								id="billingAddressIsSame"
								name="billingAddressIsSame"
								orienntation="vertical"
								error={firstError('billingAddressIsSame', props.formErrors)}
							>
								<Radio
									inputId="qa-billing-address-same"
									value="yes"
									label="Yes"
									name="billingAddressIsSame"
									checked={props.billingAddressIsSame}
									onChange={() => setBillingAddressIsSameHandler(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressIsSame"
									checked={!props.billingAddressIsSame}
									onChange={() => setBillingAddressIsSameHandler(false)}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{!props.billingAddressIsSame ? (
						<FormSection title="Your billing address">
							<BillingAddress />
						</FormSection>
					) : null}
					<FormSection title="Please select the first publication you’d like to receive">
						<Rows>
							<RadioGroup
								id="startDate"
								error={firstError('startDate', props.formErrors)}
								legend="Please select the first publication you’d like to receive"
							>
								{days.map((day) => {
									const [userDate, machineDate] = [
										formatUserDate(day),
										formatMachineDate(day),
									];
									const hideDate = machineDate.endsWith('-12-25');

									// Don't render input if Christmas day
									if (hideDate) {
										return null;
									}

									return (
										<Radio
											label={userDate}
											value={userDate}
											name={machineDate}
											checked={machineDate === props.startDate}
											onChange={() => props.setStartDate(machineDate)}
										/>
									);
								})}
							</RadioGroup>
							<Text className="component-text__paddingTop">
								<p className="component-text__sans">
									We will take the first payment on the date of your first
									publication.
								</p>
								<p className="component-text__sans">
									Please allow 1 to 7 days after publication date for your
									magazine to arrive, depending on national post services.
								</p>
							</Text>
						</Rows>
					</FormSection>
					<BillingPeriodSelector
						fulfilmentOption={fulfilmentOption}
						onChange={(billingPeriod) => props.setBillingPeriod(billingPeriod)}
						billingPeriods={weeklyBillingPeriods}
						pricingCountry={props.deliveryCountry}
						productPrices={props.productPrices}
						selected={props.billingPeriod}
					/>
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
							country={props.deliveryCountry}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							allErrors={[
								...props.billingAddressErrors,
								...props.deliveryAddressErrors,
								...props.formErrors,
							]}
							setStripePaymentMethod={props.setStripePaymentMethod}
							name={`${props.firstName} ${props.lastName}`}
							validateForm={props.validateForm}
							buttonText="Pay now"
							csrf={props.csrf}
						/>
					</FormSectionHiddenUntilSelected>
					<FormSectionHiddenUntilSelected
						id="directDebitForm"
						show={props.paymentMethod === DirectDebit}
						title="Your account details"
					>
						<DirectDebitForm
							buttonText="Subscribe"
							submitForm={props.submitForm}
							allErrors={[
								...props.billingAddressErrors,
								...props.deliveryAddressErrors,
								...props.formErrors,
							]}
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
							amount={price.price}
							billingPeriod={props.billingPeriod}
							allErrors={[
								...props.billingAddressErrors,
								...props.deliveryAddressErrors,
								...props.formErrors,
							]}
						/>
					) : null}
					<GeneralErrorMessage
						errorReason={props.submissionError}
						errorHeading={submissionErrorHeading}
					/>
					<Total
						price={price.price}
						currency={props.currencyId}
						promotions={price.promotions}
					/>
					<PaymentTerms paymentMethod={props.paymentMethod} />
				</Form>
			</Layout>
		</Content>
	);
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(WeeklyCheckoutForm);
