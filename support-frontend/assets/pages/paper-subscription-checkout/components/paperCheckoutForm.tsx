// ----- Imports ----- //
// @ts-ignore - required for hooks
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import 'redux';
import { RadioGroup, Radio } from '@guardian/src-radio';
import { TextArea } from '@guardian/src-text-area';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import Rows from 'components/base/rows';
import Text from 'components/text/text';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type {
	ProductPrices,
	ProductPrice,
} from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import {
	getProductPrice,
	getPriceWithDiscount,
} from 'helpers/productPrice/paperProductPrices';
import {
	HomeDelivery,
	Collection,
} from 'helpers/productPrice/fulfilmentOptions';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import type {
	FormField,
	FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import type { FormActionCreators } from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import GridImage from 'components/gridImage/gridImage';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { newspaperCountries } from 'helpers/internationalisation/country';
import { signOut } from 'helpers/user/user';
import { getDays } from 'pages/paper-subscription-checkout/helpers/options';
import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	getBillingAddress,
	getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Stripe, DirectDebit, PayPal } from 'helpers/forms/paymentMethods';
import { validateWithDeliveryForm } from 'helpers/subscriptionsForms/formValidation';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { withDeliveryFormIsValid } from 'helpers/subscriptionsForms/formValidation';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import {
	paperProductsWithDigital,
	paperProductsWithoutDigital,
} from 'helpers/productPrice/productOptions';
import { Paper } from 'helpers/productPrice/subscriptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import {
	getPaymentStartDate,
	getFormattedStartDate,
} from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { titles } from 'helpers/user/details';
import { Select, Option as OptionForSelect } from '@guardian/src-select';
import { options } from 'components/forms/customFields/options';
import PaperOrderSummary from 'pages/paper-subscription-checkout/components/orderSummary/orderSummary';
import AddDigiSubCta from 'pages/paper-subscription-checkout/components/addDigiSubCta';
import {
	getPriceSummary,
	sensiblyGenerateDigiSubPrice,
} from 'pages/paper-subscription-checkout/helpers/orderSummaryText';
import { paperSubsUrl } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';
import type { Participations } from 'helpers/abTests/abtest';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;
const controlTextAreaResizing = css`
	resize: vertical;
`;
const removeTopBorder = css`
	.component-checkout-form-section ~ & {
		border-top: none;
	}
`;
// ----- Types ----- //
type PropTypes = FormFields &
	FormActionCreators & {
		signOut: typeof signOut;
		formErrors: FormError<FormField>[];
		submissionError: ErrorReason | null;
		productPrices: ProductPrices;
		fetchAndStoreUserType: (...args: Array<any>) => any;
		submitForm: (...args: Array<any>) => any;
		billingAddressErrors: Array<Record<string, any>>;
		deliveryAddressErrors: Array<Record<string, any>>;
		country: IsoCountry;
		isTestUser: boolean;
		validateForm: () => (...args: Array<any>) => any;
		csrf: Csrf;
		currencyId: IsoCurrency;
		payPalHasLoaded: boolean;
		formIsValid: (...args: Array<any>) => any;
		setupRecurringPayPalPayment: (...args: Array<any>) => any;
		total: ProductPrice;
		// eslint-disable-next-line react/no-unused-prop-types
		amount: number;
		productOption: ActivePaperProducts;
		fulfilmentOption: FulfilmentOptions;
		participations: Participations;
	};

// ----- Map State/Props ----- //
function mapStateToProps(state: WithDeliveryCheckoutState) {
	return {
		...getFormFields(state),
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkout.productPrices,
		billingAddressErrors: state.page.deliveryAddress.fields.formErrors,
		deliveryAddressErrors: state.page.billingAddress.fields.formErrors,
		isTestUser: state.page.checkout.isTestUser,
		country: state.common.internationalisation.countryId,
		csrf: state.page.csrf,
		currencyId: state.common.internationalisation.currencyId,
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
		total: getPriceWithDiscount(
			state.page.checkout.productPrices,
			state.page.checkout.fulfilmentOption,
			state.page.checkout.productOption,
		),
		amount: getProductPrice(
			state.page.checkout.productPrices,
			state.page.checkout.fulfilmentOption,
			state.page.checkout.productOption,
		),
		participations: state.common.abParticipations,
	};
}

function mapDispatchToProps() {
	return {
		...formActionCreators,
		fetchAndStoreUserType:
			(email) =>
			(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
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
					trackSubmitAttempt(PayPal, Paper, state.page.checkout.productOption);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
		signOut,
	};
}

// ----- Form Fields ----- //
const DeliveryAddress = withStore(
	newspaperCountries,
	'delivery',
	getDeliveryAddress,
);
const BillingAddress = withStore(
	newspaperCountries,
	'billing',
	getBillingAddress,
);

// ----- Lifecycle hooks ----- //
// Updated to use useEffect so it only fires once (like componentDidMount)
function setSubsCardStartDateInState(setStartDate, startDate) {
	useEffect(() => {
		setStartDate(formatMachineDate(startDate));
	}, []);
}

// ----- Component ----- //
function PaperCheckoutForm(props: PropTypes) {
	const days = getDays(props.fulfilmentOption, props.productOption);
	const isHomeDelivery = props.fulfilmentOption === HomeDelivery;
	const fulfilmentOptionDescriptor = isHomeDelivery
		? 'Newspaper'
		: 'Subscription card';
	const deliveryTitle = isHomeDelivery
		? 'Where should we deliver your newspaper?'
		: 'Where should we deliver your subscription card?';
	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';
	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.country,
	);
	const isSubscriptionCard = props.fulfilmentOption === Collection;
	let formattedStartDate = '';

	if (isSubscriptionCard) {
		const timeNow = Date.now();
		const startDate = getPaymentStartDate(timeNow, props.productOption);
		formattedStartDate = getFormattedStartDate(startDate);
		setSubsCardStartDateInState(props.setStartDate, startDate);
	}

	const [digiSubPriceString, setDigiSubPriceString] = useState<string>('');
	const [includesDigiSub, setIncludesDigiSub] = useState<boolean>(false);
	const simplePrice = digiSubPriceString.replace(/\/(.*)/, ''); // removes anything after the /

	const priceHasRedundantFloat = simplePrice.split('.')[1] === '00'; // checks whether price is something like '£10.00'

	const cleanedPrice = priceHasRedundantFloat
		? simplePrice.replace(/\.(.*)/, '')
		: simplePrice; // removes decimal point if there are no pence

	const expandedPricingText = `${cleanedPrice} per month`;

	function addDigitalSubscription(
		event: React.SyntheticEvent<HTMLInputElement>,
	) {
		setIncludesDigiSub(event.target.checked);
		props.setAddDigitalSubscription(event.target.checked);
	}

	useEffect(() => {
		// Price of the 'Plus' product that corresponds to the selected product option
		const plusPrice = includesDigiSub
			? props.total
			: getPriceWithDiscount(
					props.productPrices,
					props.fulfilmentOption,
					paperProductsWithDigital[props.productOption],
			  );
		// Price of the standard paper-only product that corresponds to the selected product option
		const paperPrice = includesDigiSub
			? getPriceWithDiscount(
					props.productPrices,
					props.fulfilmentOption,
					paperProductsWithoutDigital[props.productOption],
			  )
			: props.total;
		const digitalCost = sensiblyGenerateDigiSubPrice(plusPrice, paperPrice);
		setDigiSubPriceString(
			getPriceSummary(showPrice(digitalCost, false), props.billingPeriod),
		);
	}, []);
	const subsCardOrderSummary = (
		<PaperOrderSummary
			image={
				<GridImage
					gridId="printCampaignDigitalVoucher"
					srcSizes={[500]}
					sizes="(max-width: 740px) 50vw, 696"
					imgType="png"
					altText=""
				/>
			}
			total={props.total}
			digiSubPrice={expandedPricingText}
			startDate={formattedStartDate}
			includesDigiSub={includesDigiSub}
			changeSubscription={`${paperSubsUrl(
				false,
				getQueryParameter('promoCode'),
			)}#subscribe`}
		/>
	);
	const homeDeliveryOrderSummary = (
		<PaperOrderSummary
			image={
				<GridImage
					gridId="printCampaignHDdigitalVoucher"
					srcSizes={[500]}
					sizes="(max-width: 740px) 50vw, 696"
					imgType="png"
					altText=""
				/>
			}
			total={props.total}
			digiSubPrice={expandedPricingText}
			includesDigiSub={includesDigiSub}
			changeSubscription={`${paperSubsUrl(
				true,
				getQueryParameter('promoCode'),
			)}#subscribe`}
			productType={Paper}
			paymentStartDate={formattedStartDate}
		/>
	);
	return (
		<Content modifierClasses={['your-details']}>
			<Layout
				aside={isHomeDelivery ? homeDeliveryOrderSummary : subsCardOrderSummary}
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
							isUsingGuestCheckout
						/>
					</FormSection>

					<FormSection title={deliveryTitle}>
						<DeliveryAddress />
						{isHomeDelivery ? (
							<TextArea
								css={controlTextAreaResizing}
								id="delivery-instructions"
								label="Delivery instructions"
								autocomplete="new-password" // Using "new-password" here because "off" isn't working in chrome
								supporting="Please let us know any details to help us find your property (door colour, any access issues) and the best place to leave your newspaper. For example, 'Front door - red - on Crinan Street, put through letterbox'"
								maxlength={250}
								value={props.deliveryInstructions}
								onChange={(e) => props.setDeliveryInstructions(e.target.value)}
								optional
							/>
						) : null}
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
									checked={props.billingAddressIsSame === true}
									onChange={() => props.setBillingAddressIsSame(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressIsSame"
									checked={props.billingAddressIsSame === false}
									onChange={() => props.setBillingAddressIsSame(false)}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{props.billingAddressIsSame === false ? (
						<FormSection title="Your billing address">
							<BillingAddress />
						</FormSection>
					) : null}
					{isHomeDelivery ? (
						<FormSection title="When would you like your subscription to start?">
							<Rows>
								<RadioGroup
									label="When would you like your subscription to start?"
									hideLabel
									id="startDate"
									error={firstError('startDate', props.formErrors)}
									legend="When would you like your subscription to start?"
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
									<p>
										We will take the first payment on the date you receive your
										first {fulfilmentOptionDescriptor.toLowerCase()}.
									</p>
									<p>
										Subscription start dates are automatically selected to be
										the earliest we can fulfil your order.
									</p>
								</Text>
							</Rows>
						</FormSection>
					) : null}
					<AddDigiSubCta
						digiSubPrice={expandedPricingText}
						addDigitalSubscription={addDigitalSubscription}
					/>
					{paymentMethods.length > 1 ? (
						<FormSection
							cssOverrides={removeTopBorder}
							title="How would you like to pay?"
						>
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
							amount={props.total.price}
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
					<DirectDebitPaymentTerms paymentMethod={props.paymentMethod} />
				</Form>
			</Layout>
		</Content>
	);
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(PaperCheckoutForm);
