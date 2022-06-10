// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Radio,
	RadioGroup,
	Select,
	TextArea,
} from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import type { ConnectedProps } from 'react-redux';
import type { Dispatch } from 'redux';
import Rows from 'components/base/rows';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import type { CsrCustomerData } from 'components/csr/csrMode';
import { useCsrCustomerData } from 'components/csr/csrMode';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import { options } from 'components/forms/customFields/options';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import {
	BillingAddress,
	DeliveryAddress,
} from 'components/subscriptionCheckouts/address/scopedAddressFields';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Text from 'components/text/text';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { newspaperCountries } from 'helpers/internationalisation/country';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import {
	getPriceWithDiscount,
	getProductPrice,
} from 'helpers/productPrice/paperProductPrices';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import {
	paperProductsWithDigital,
	paperProductsWithoutDigital,
} from 'helpers/productPrice/productOptions';
import { showPrice } from 'helpers/productPrice/productPrices';
import { Paper } from 'helpers/productPrice/subscriptions';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
	formActionCreators,
	setCsrCustomerData,
} from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import {
	validateWithDeliveryForm,
	withDeliveryFormIsValid,
} from 'helpers/subscriptionsForms/formValidation';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { paperSubsUrl } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';
import { titles } from 'helpers/user/details';
import { signOut } from 'helpers/user/user';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import AddDigiSubCta from 'pages/paper-subscription-checkout/components/addDigiSubCta';
import PaperOrderSummary from 'pages/paper-subscription-checkout/components/orderSummary/orderSummary';
import { getDays } from 'pages/paper-subscription-checkout/helpers/options';
import {
	getPriceSummary,
	sensiblyGenerateDigiSubPrice,
} from 'pages/paper-subscription-checkout/helpers/orderSummaryText';
import {
	getFormattedStartDate,
	getPaymentStartDate,
} from 'pages/paper-subscription-checkout/helpers/subsCardDays';

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
			(email: string) =>
			(dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
				fetchAndStoreUserType(email)(dispatch, getState);
			},
		formIsValid:
			() =>
			(
				_dispatch: Dispatch<Action>,
				getState: () => WithDeliveryCheckoutState,
			) =>
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
		setCsrCustomerData: (customerData: CsrCustomerData) =>
			setCsrCustomerData('delivery', customerData),
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

type PropTypes = ConnectedProps<typeof connector>;

// ----- Lifecycle hooks ----- //
// Updated to use useEffect so it only fires once (like componentDidMount)
function setSubsCardStartDateInState(
	setStartDate: (s: string) => void,
	startDate: Date,
) {
	useEffect(() => {
		setStartDate(formatMachineDate(startDate));
	}, []);
}

// ----- Component ----- //
function PaperCheckoutForm(props: PropTypes) {
	useCsrCustomerData(props.setCsrCustomerData);

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
		const startDate = getPaymentStartDate(
			timeNow,
			props.productOption as ActivePaperProducts,
		);
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

	function addDigitalSubscription(event: React.ChangeEvent<HTMLInputElement>) {
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
			startDate={formattedStartDate}
		/>
	);

	return (
		<Content>
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
							data-qm-masking="blocklist"
							label="Title"
							optional
							value={props.title ?? ''}
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

					<FormSection title={deliveryTitle}>
						<DeliveryAddress countries={newspaperCountries} />
						{isHomeDelivery ? (
							<TextArea
								css={controlTextAreaResizing}
								id="delivery-instructions"
								data-qm-masking="blocklist"
								label="Delivery instructions"
								autoComplete="new-password" // Using "new-password" here because "off" isn't working in chrome
								supporting="Please let us know any details to help us find your property (door colour, any access issues) and the best place to leave your newspaper. For example, 'Front door - red - on Crinan Street, put through letterbox'"
								maxLength={250}
								value={props.deliveryInstructions ?? ''}
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
								orientation="vertical"
								error={firstError('billingAddressIsSame', props.formErrors)}
							>
								<Radio
									id="qa-billing-address-same"
									value="yes"
									label="Yes"
									name="billingAddressIsSame"
									checked={props.billingAddressIsSame}
									onChange={() => props.setBillingAddressIsSame(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressIsSame"
									checked={!props.billingAddressIsSame}
									onChange={() => props.setBillingAddressIsSame(false)}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{!props.billingAddressIsSame ? (
						<FormSection title="Your billing address">
							<BillingAddress countries={newspaperCountries} />
						</FormSection>
					) : null}
					{isHomeDelivery ? (
						<FormSection title="When would you like your subscription to start?">
							<Rows>
								<RadioGroup
									label="When would you like your subscription to start?"
									hideLabel
									name="startDate"
									id="startDate"
									error={firstError('startDate', props.formErrors)}
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
							allErrors={
								[
									...props.billingAddressErrors,
									...props.deliveryAddressErrors,
									...props.formErrors,
								] as Array<FormError<FormField>>
							}
							setStripePaymentMethod={props.setStripePaymentMethod}
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
							allErrors={
								[
									...props.billingAddressErrors,
									...props.deliveryAddressErrors,
									...props.formErrors,
								] as Array<FormError<FormField>>
							}
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

export default connector(PaperCheckoutForm);
