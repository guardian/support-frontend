// ----- Imports ----- //
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Radio, RadioGroup } from '@guardian/src-radio';
import { Option as OptionForSelect, Select } from '@guardian/src-select';
import React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import 'redux';
import Rows from 'components/base/rows';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import { options } from 'components/forms/customFields/options';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import Heading from 'components/heading/heading';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import type { SetCountryChangedAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { addressActionCreatorsFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import PaymentTerms from 'components/subscriptionCheckouts/paymentTerms';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PersonalDetailsGift } from 'components/subscriptionCheckouts/personalDetailsGift';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Summary from 'components/subscriptionCheckouts/summary';
import Total from 'components/subscriptionCheckouts/total/total';
import Text from 'components/text/text';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { countries } from 'helpers/internationalisation/country';
import { currencyFromCountryCode } from 'helpers/internationalisation/currency';
import { weeklyDeliverableCountries } from 'helpers/internationalisation/weeklyDeliverableCountries';
import type { SetCountryAction } from 'helpers/page/commonActions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import {
	validateWithDeliveryForm,
	withDeliveryFormIsValid,
} from 'helpers/subscriptionsForms/formValidation';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	getBillingAddress,
	getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { routes } from 'helpers/urls/routes';
import { titles } from 'helpers/user/details';
import { signOut } from 'helpers/user/user';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import 'helpers/page/commonActions';
import './weeklyCheckout.scss';

// ----- Styles ----- //
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

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
		currencyId:
			currencyFromCountryCode(deliveryAddress.fields.country) ??
			state.common.internationalisation.defaultCurrency,
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
	};
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
	const { setCountry } = addressActionCreatorsFor('billing');
	return {
		...formActionCreators,
		fetchAndStoreUserType:
			(email: string) =>
			(
				dispatch: Dispatch<Action>,
				getState: () => WithDeliveryCheckoutState,
			) => {
				fetchAndStoreUserType(email)(dispatch, getState);
			},
		formIsValid:
			() => (_: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
				withDeliveryFormIsValid(getState()),

		submitForm:
			() =>
			(dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
				submitWithDeliveryForm(dispatch, getState()),
		signOut,
		setBillingCountry:
			(country: string) =>
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

const connector = connect(mapStateToProps, mapDispatchToProps());

// ----- Types ----- //
type PropTypes = ConnectedProps<typeof connector>;

// ----- Form Fields ----- //
const DeliveryAddress = withStore(
	weeklyDeliverableCountries,
	'delivery',
	getDeliveryAddress,
);

const BillingAddress = withStore(countries, 'billing', getBillingAddress);

const days = getWeeklyDays();

// ----- Component ----- //
function WeeklyCheckoutFormGifting(props: PropTypes): JSX.Element {
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

	const setBillingAddressIsSameHandler = (newState: boolean) => {
		props.setBillingAddressIsSame(newState);
		props.setBillingCountry(props.deliveryCountry);
	};

	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.billingCountry,
	);

	return (
		<Content>
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
							value={props.titleGiftRecipient ?? undefined}
							onChange={(e) => props.setTitleGift(e.target.value)}
						>
							<OptionForSelect>Select a title</OptionForSelect>
							{options(titles)}
						</Select>
						<PersonalDetailsGift
							firstNameGiftRecipient={props.firstNameGiftRecipient ?? ''}
							setFirstNameGift={props.setFirstNameGift}
							lastNameGiftRecipient={props.lastNameGiftRecipient ?? ''}
							setLastNameGift={props.setLastNameGift}
							emailGiftRecipient={props.emailGiftRecipient ?? ''}
							setEmailGift={props.setEmailGift}
							formErrors={props.formErrors}
						/>
					</FormSection>
					<FormSection title="Gift delivery date">
						<Rows>
							<RadioGroup
								id="startDate"
								name="startDate"
								error={firstError('startDate', props.formErrors) as string}
								label="Gift delivery date"
							>
								{days.map((day) => {
									const [userDate, machineDate] = [
										formatUserDate(day),
										formatMachineDate(day),
									];

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
							value={props.title ?? undefined}
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
								orientation="vertical"
								error={
									firstError('billingAddressIsSame', props.formErrors) as string
								}
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
								validationError={
									firstError('paymentMethod', props.formErrors) as string
								}
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
							// @ts-expect-error TODO: Fixing the types around validation errors will affect every checkout, too much to tackle now
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
							// @ts-expect-error TODO: Fixing the types around validation errors will affect every checkout, too much to tackle now
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
}

// ----- Exports ----- //
export default connector(WeeklyCheckoutFormGifting);
