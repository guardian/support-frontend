// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	Option as OptionForSelect,
	Radio,
	RadioGroup,
	Select,
	TextArea,
} from '@guardian/source/react-components';
import { newspaperCountries } from '@modules/internationalisation/country';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import { useEffect, useState } from 'react';
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
	DisclaimerOnSubscribeStyles,
	StripeDisclaimer,
} from 'components/stripe/stripeDisclaimer';
import {
	BillingAddress,
	DeliveryAddress,
	PaperAddress,
} from 'components/subscriptionCheckouts/address/scopedAddressFields';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Text from 'components/text/text';
import { setupSubscriptionPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { showPrice } from 'helpers/productPrice/productPrices';
import { Paper } from 'helpers/productPrice/subscriptions';
import { setDeliveryAgent } from 'helpers/redux/checkout/addressMeta/actions';
import {
	selectCorrespondingProductOptionPrice,
	selectDiscountedPrice,
	selectPriceForProduct,
} from 'helpers/redux/checkout/product/selectors/productPrice';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import {
	formActionCreators,
	setCsrCustomerData,
} from 'helpers/subscriptionsForms/formActionCreators';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import {
	validateWithDeliveryForm,
	withDeliveryFormIsValid,
} from 'helpers/subscriptionsForms/formValidation';
import {
	submitWithDeliveryForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/supportedPaymentMethods';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { sendEventSubscriptionCheckoutStart } from 'helpers/tracking/quantumMetric';
import type { DateYMDString } from 'helpers/types/DateString';
import { paperSubsUrl } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';
import { titles } from 'helpers/user/details';
import { signOut } from 'helpers/user/user';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { logException } from 'helpers/utilities/logger';
import PaperOrderSummary from 'pages/paper-subscription-checkout/components/paperOrderSummary/paperOrderSummary';
import { getDays } from 'pages/paper-subscription-checkout/helpers/options';
import {
	getPriceSummary,
	sensiblyGenerateDigiSubPrice,
} from 'pages/paper-subscription-checkout/helpers/orderSummaryText';
import {
	getFormattedStartDate,
	getPaymentStartDate,
} from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import type { ActivePaperProductOptions } from '../../../helpers/productCatalogToProductOption';
import { setStripePublicKey } from '../../../helpers/redux/checkout/payment/stripeAccountDetails/actions';
import { DeliveryAgentsSelect } from './deliveryAgentsSelect';

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
function mapStateToProps(state: SubscriptionsState) {
	return {
		...getFormFields(state),
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkoutForm.product.productPrices,
		billingAddressErrors: state.page.checkoutForm.billingAddress.fields.errors,
		deliveryAddressErrors:
			state.page.checkoutForm.deliveryAddress.fields.errors,
		isTestUser: state.page.user.isTestUser,
		country: state.common.internationalisation.countryId,
		billingCountry: state.page.checkoutForm.billingAddress.fields.country,
		csrf: state.page.checkoutForm.csrf,
		currencyId: state.common.internationalisation.currencyId,
		payPalHasLoaded: state.page.checkoutForm.payment.payPal.hasLoaded,
		price: selectPriceForProduct(state),
		discountedPrice: selectDiscountedPrice(state),
		correspondingProductOptionPrice:
			selectCorrespondingProductOptionPrice(state),
		participations: state.common.abParticipations,
		deliveryAgentsResponse:
			state.page.checkoutForm.addressMeta.deliveryAgent.response,
		chosenDeliveryAgent:
			state.page.checkoutForm.addressMeta.deliveryAgent.chosenAgent,
	};
}

function mapDispatchToProps() {
	return {
		...formActionCreators,
		formIsValid:
			() => (_dispatch: Dispatch<Action>, getState: () => SubscriptionsState) =>
				withDeliveryFormIsValid(getState()),
		submitForm:
			() => (dispatch: Dispatch<Action>, getState: () => SubscriptionsState) =>
				submitWithDeliveryForm(dispatch, getState()),
		validateForm:
			() =>
			(dispatch: Dispatch<Action>, getState: () => SubscriptionsState) => {
				const state = getState();
				validateWithDeliveryForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkoutForm.payment;

				if (paymentMethod.name === PayPal) {
					trackSubmitAttempt(
						PayPal,
						Paper,
						state.page.checkoutForm.product.productOption,
					);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
		signOut,
		setCsrCustomerData: (customerData: CsrCustomerData) =>
			setCsrCustomerData('delivery', customerData),
		setDeliveryAgent,
		setStripePublicKey,
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

type PropTypes = ConnectedProps<typeof connector>;

// ----- Lifecycle hooks ----- //
// Updated to use useEffect so it only fires once (like componentDidMount)
function setSubsCardStartDateInState(
	setStartDate: (dateString: DateYMDString) => void,
	startDate: Date,
) {
	useEffect(() => {
		setStartDate(formatMachineDate(startDate));
	}, []);
}

// ----- Component ----- //
function PaperCheckoutForm(props: PropTypes) {
	useCsrCustomerData(props.setCsrCustomerData);

	const invalidDeliveryDates = ['-12-25', '-01-01'];

	const days = getDays(props.fulfilmentOption, props.productOption).filter(
		(day) => {
			const date = formatMachineDate(day);
			return !invalidDeliveryDates.some((dateSuffix) =>
				date.endsWith(dateSuffix),
			);
		},
	);

	const isHomeDelivery = props.fulfilmentOption === HomeDelivery;

	if (props.deliveryAgentsResponse?.type === 'PaperRoundError') {
		logException(`Error fetching delivery providers`);
	}

	const fulfilmentOptionDescriptor = isHomeDelivery
		? 'Newspaper'
		: 'Subscription card';

	const deliveryTitle = isHomeDelivery
		? 'Where should we deliver your newspaper?'
		: 'Where should we deliver your subscription card?';

	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry, there was a problem'
			: 'Sorry, we could not process your payment';

	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.billingAddressMatchesDelivery ? props.country : props.billingCountry,
	);

	const isSubscriptionCard = props.fulfilmentOption === Collection;
	let formattedStartDate = '';

	if (isSubscriptionCard) {
		const timeNow = Date.now();
		const startDate = getPaymentStartDate(
			timeNow,
			props.productOption as ActivePaperProductOptions,
		);
		formattedStartDate = getFormattedStartDate(startDate);
		setSubsCardStartDateInState(props.setStartDate, startDate);
	}

	const [digiSubPriceString, setDigiSubPriceString] = useState<string>('');
	const [includesDigiSub] = useState<boolean>(false);

	const simplePrice = digiSubPriceString.replace(/\/(.*)/, ''); // removes anything after the /

	const priceHasRedundantFloat = simplePrice.split('.')[1] === '00'; // checks whether price is something like '£10.00'

	const cleanedPrice = priceHasRedundantFloat
		? simplePrice.replace(/\.(.*)/, '')
		: simplePrice; // removes decimal point if there are no pence

	const expandedPricingText = `${cleanedPrice} per month`;

	const deliveryInstructionsError = props.formErrors.find(
		(error) => error.field === 'deliveryInstructions',
	);

	useEffect(() => {
		// Price of the 'Plus' product that corresponds to the selected product option
		const plusPrice = includesDigiSub
			? props.discountedPrice
			: props.correspondingProductOptionPrice;

		// Price of the standard paper-only product that corresponds to the selected product option
		const paperPrice = includesDigiSub
			? props.correspondingProductOptionPrice
			: props.discountedPrice;

		const digitalCost = sensiblyGenerateDigiSubPrice(plusPrice, paperPrice);
		setDigiSubPriceString(
			getPriceSummary(showPrice(digitalCost, false), props.billingPeriod),
		);

		sendEventSubscriptionCheckoutStart(
			props.product,
			false,
			props.price,
			props.billingPeriod,
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
			total={props.discountedPrice}
			digiSubPrice={expandedPricingText}
			startDate={formattedStartDate}
			includesDigiSub={includesDigiSub}
			changeSubscription={`${paperSubsUrl(
				Collection,
				getQueryParameter('promoCode'),
			)}`}
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
			total={props.discountedPrice}
			digiSubPrice={expandedPricingText}
			includesDigiSub={includesDigiSub}
			changeSubscription={`${paperSubsUrl(
				HomeDelivery,
				getQueryParameter('promoCode'),
			)}`}
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
							cssOverrides={marginBottom}
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
							telephone={props.telephone}
							setTelephone={props.setTelephone}
							formErrors={props.formErrors}
							signOut={props.signOut}
						/>
					</FormSection>

					<FormSection title={deliveryTitle}>
						{isHomeDelivery ? (
							<PaperAddress countries={newspaperCountries} />
						) : (
							<DeliveryAddress countries={newspaperCountries} />
						)}
						{isHomeDelivery && (
							<DeliveryAgentsSelect
								deliveryAgentsResponse={props.deliveryAgentsResponse}
								chosenDeliveryAgent={props.chosenDeliveryAgent}
								setDeliveryAgent={props.setDeliveryAgent}
								formErrors={props.formErrors}
								deliveryAddressErrors={props.deliveryAddressErrors}
							/>
						)}
						{isHomeDelivery ? (
							<TextArea
								error={deliveryInstructionsError?.message}
								cssOverrides={controlTextAreaResizing}
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
								id="billingAddressMatchesDelivery"
								name="billingAddressMatchesDelivery"
								orientation="vertical"
								error={firstError(
									'billingAddressMatchesDelivery',
									props.formErrors,
								)}
							>
								<Radio
									id="qa-billing-address-same"
									value="yes"
									label="Yes"
									name="billingAddressMatchesDelivery"
									checked={props.billingAddressMatchesDelivery}
									onChange={() => props.setBillingAddressMatchesDelivery(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressMatchesDelivery"
									checked={!props.billingAddressMatchesDelivery}
									onChange={() => props.setBillingAddressMatchesDelivery(false)}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{!props.billingAddressMatchesDelivery ? (
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
					{paymentMethods.length > 0 ? (
						<FormSection
							cssOverrides={removeTopBorder}
							title={
								paymentMethods.length > 1
									? 'How would you like to pay?'
									: 'Payment Method'
							}
						>
							<PaymentMethodSelector
								availablePaymentMethods={paymentMethods}
								paymentMethod={props.paymentMethod}
								setPaymentMethod={(paymentMethod) =>
									props.setPaymentMethod({ paymentMethod })
								}
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
							currency={props.currencyId}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							allErrors={
								[
									...props.billingAddressErrors,
									...props.deliveryAddressErrors,
									...props.formErrors,
								] as Array<FormError<FormField>>
							}
							validateForm={props.validateForm}
							buttonText="Pay now"
							csrf={props.csrf}
							setStripePublicKey={(key: string) =>
								props.setStripePublicKey(key)
							}
						/>
						<p css={DisclaimerOnSubscribeStyles}>
							<StripeDisclaimer />
						</p>
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
							amount={props.discountedPrice.price}
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
						errorReason={props.submissionError ?? undefined}
						errorHeading={submissionErrorHeading}
					/>
					<DirectDebitPaymentTerms paymentMethod={props.paymentMethod} />
				</Form>
			</Layout>
		</Content>
	);
} // ----- Exports ----- //

export default connector(PaperCheckoutForm);
