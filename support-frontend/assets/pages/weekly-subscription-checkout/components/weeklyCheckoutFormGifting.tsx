// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import 'redux';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
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
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import Summary from 'components/subscriptionCheckouts/summary';
import Text from 'components/text/text';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import type {
	FormField,
	FormFields,
	FormField as PersonalDetailsFormField,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import { PersonalDetailsGift } from 'components/subscriptionCheckouts/personalDetailsGift';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countries } from 'helpers/internationalisation/country';
import { weeklyDeliverableCountries } from 'helpers/internationalisation/weeklyDeliverableCountries';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { routes } from 'helpers/urls/routes';
import { signOut } from 'helpers/user/user';
import type {
	Action,
	FormActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	getBillingAddress,
	getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import type { SetCountryAction } from 'helpers/page/commonActions';
import 'helpers/page/commonActions';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import {
	validateWithDeliveryForm,
	withDeliveryFormIsValid,
} from 'helpers/subscriptionsForms/formValidation';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Heading from 'components/heading/heading';
import './weeklyCheckout.scss';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import PaymentTerms from 'components/subscriptionCheckouts/paymentTerms';
import Total from 'components/subscriptionCheckouts/total/total';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { titles } from 'helpers/user/details';
import { Option as OptionForSelect, Select } from '@guardian/src-select';
import { options } from 'components/forms/customFields/options';
import { currencyFromCountryCode } from 'helpers/internationalisation/currency';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
// ----- Styles ----- //
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;
// ----- Types ----- //
type PropTypes = FormFields &
	FormActionCreators & {
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
		// eslint-disable-next-line react/no-unused-prop-types
		country: IsoCountry;
		isTestUser: boolean;
		validateForm: () => (...args: any[]) => any;
		csrf: Csrf;
		currencyId: IsoCurrency;
		payPalHasLoaded: boolean;
		formIsValid: (...args: any[]) => any;
		setupRecurringPayPalPayment: (...args: any[]) => any;
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
		country: state.common.internationalisation.countryId,
		csrf: state.page.csrf,
		currencyId: currencyFromCountryCode(deliveryAddress.fields.country),
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
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
function WeeklyCheckoutFormGifting(props: PropTypes) {
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
								gridId="checkoutPackshotWeeklyGifting"
								srcSizes={[696, 500]}
								sizes="(max-width: 740px) 50vw, 696"
								imgType="png"
								altText=""
							/>
						}
						title="Guardian Weekly"
						description=""
						productPrice={price}
						billingPeriod={props.billingPeriod}
						changeSubscription={routes.guardianWeeklySubscriptionLandingGift}
						product={props.product}
						orderIsAGift
					/>
				}
			>
				<Form
					onSubmit={(ev) => {
						ev.preventDefault();
						props.submitForm();
					}}
				>
					<FormSection border="none" id="weekly-checkout__heading-form-section">
						<Heading
							size={1}
							className="component-checkout-form-section__heading component-heading--gift"
						>
							Tell us about your gift
						</Heading>
					</FormSection>
					<FormSection title="Gift recipient's details" border="bottom">
						<Select
							css={marginBottom}
							id="title"
							label="Title"
							optional
							value={props.titleGiftRecipient}
							onChange={(e) => props.setTitleGift(e.target.value)}
						>
							<OptionForSelect>Select a title</OptionForSelect>
							{options(titles)}
						</Select>
						<PersonalDetailsGift
							firstNameGiftRecipient={props.firstNameGiftRecipient || ''}
							setFirstNameGift={props.setFirstNameGift}
							lastNameGiftRecipient={props.lastNameGiftRecipient || ''}
							setLastNameGift={props.setLastNameGift}
							emailGiftRecipient={props.emailGiftRecipient || ''}
							setEmailGift={props.setEmailGift}
							formErrors={
								props.formErrors as any as Array<
									FormError<PersonalDetailsFormField>
								>
							}
						/>
					</FormSection>
					<FormSection title="Gift delivery date">
						<Rows>
							<RadioGroup
								id="startDate"
								error={firstError('startDate', props.formErrors)}
								legend="Gift delivery date"
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
									We will take payment on the date the recipient receives the
									first Guardian Weekly.
								</p>
								<p className="component-text__sans">
									Subscription start dates are automatically selected to be the
									earliest we can fulfil your order.
								</p>
							</Text>
						</Rows>
					</FormSection>
					<FormSection title="Gift recipient's address">
						<DeliveryAddress />
					</FormSection>
					<FormSection
						border="top"
						id="weekly-checkout__heading-form-section--second"
					>
						<Heading
							size={2}
							className="component-checkout-form-section__heading component-heading--gift"
						>
							Payment information
						</Heading>
					</FormSection>
					<FormSection title="Your details" border="bottom">
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
							setConfirmEmail={props.setConfirmEmail}
							isSignedIn={props.isSignedIn}
							fetchAndStoreUserType={props.fetchAndStoreUserType}
							telephone={props.telephone}
							setTelephone={props.setTelephone}
							formErrors={props.formErrors}
							signOut={props.signOut}
						/>
					</FormSection>
					<FormSection title="Is the billing address the same as the recipient's address?">
						<Rows>
							<RadioGroup
								label="Is the billing address the same as the recipient's address?"
								hideLabel
								id="billingAddressIsSame"
								name="billingAddressIsSame"
								orienntation="vertical"
								error={firstError('billingAddressIsSame', props.formErrors)}
							>
								<Radio
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
					<PaymentTerms orderIsAGift paymentMethod={props.paymentMethod} />
				</Form>
			</Layout>
		</Content>
	);
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(WeeklyCheckoutFormGifting);
