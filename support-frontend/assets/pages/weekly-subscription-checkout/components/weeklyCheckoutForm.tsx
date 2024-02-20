// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Radio,
	RadioGroup,
	Select,
} from '@guardian/source-react-components';
import { useEffect } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Rows from 'components/base/rows';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import { useCsrCustomerData } from 'components/csr/csrMode';
import type { CsrCustomerData } from 'components/csr/csrMode';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import { options } from 'components/forms/customFields/options';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import {
	BillingAddress,
	DeliveryAddress,
} from 'components/subscriptionCheckouts/address/scopedAddressFields';
import { BillingPeriodSelector } from 'components/subscriptionCheckouts/billingPeriodSelector';
import { DigitalPlusPrintSummary } from 'components/subscriptionCheckouts/digitalPlusPrintSummary';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import PaymentTerms from 'components/subscriptionCheckouts/paymentTerms';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Summary from 'components/subscriptionCheckouts/summary';
import ThreeTierTerms from 'components/subscriptionCheckouts/threeTierTerms';
import Total from 'components/subscriptionCheckouts/total/total';
import Text from 'components/text/text';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { billableCountries } from 'helpers/internationalisation/billableCountries';
import {
	currencies,
	currencyFromCountryCode,
} from 'helpers/internationalisation/currency';
import { gwDeliverableCountries } from 'helpers/internationalisation/gwDeliverableCountries';
import { weeklyBillingPeriods } from 'helpers/productPrice/billingPeriods';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setBillingCountry } from 'helpers/redux/checkout/address/actions';
import { getUserTypeFromIdentity } from 'helpers/redux/checkout/personalDetails/thunks';
import {
	selectDiscountedPrice,
	selectPriceForProduct,
} from 'helpers/redux/checkout/product/selectors/productPrice';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import {
	formActionCreators,
	setCsrCustomerData,
} from 'helpers/subscriptionsForms/formActionCreators';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
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
import { sendEventSubscriptionCheckoutStart } from 'helpers/tracking/quantumMetric';
import { routes } from 'helpers/urls/routes';
import { titles } from 'helpers/user/details';
import { signOut } from 'helpers/user/user';
import {
	formatMachineDate,
	formatUserDate,
} from 'helpers/utilities/dateConversions';
import { recurringContributionPeriodMap } from 'helpers/utilities/timePeriods';
import { tierCardsVariantB as tierCards } from 'pages/supporter-plus-landing/setup/threeTierConfig';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

// ----- Styles ----- //
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

// ----- Map State/Props ----- //
function mapStateToProps(state: SubscriptionsState) {
	const { billingAddress, deliveryAddress, addressMeta } =
		state.page.checkoutForm;
	const { billingAddressMatchesDelivery } = addressMeta;
	return {
		...getFormFields(state),
		billingCountry: billingAddressMatchesDelivery
			? deliveryAddress.fields.country
			: billingAddress.fields.country,
		deliveryCountry: deliveryAddress.fields.country,
		fulfilmentOption: state.page.checkoutForm.product.fulfilmentOption,
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkoutForm.product.productPrices,
		deliveryAddressErrors:
			state.page.checkoutForm.deliveryAddress.fields.errors,
		billingAddressErrors: state.page.checkoutForm.billingAddress.fields.errors,
		isTestUser: state.page.user.isTestUser,
		csrf: state.page.checkoutForm.csrf,
		currencyId:
			currencyFromCountryCode(deliveryAddress.fields.country) ?? 'USD',
		payPalHasLoaded: state.page.checkoutForm.payment.payPal.hasLoaded,
		price: selectPriceForProduct(state),
		discountedPrice: selectDiscountedPrice(state),
		participations: state.common.abParticipations,
		countryGroupId: state.common.internationalisation.countryGroupId,
	};
}

function mapDispatchToProps() {
	return {
		...formActionCreators,
		fetchAndStoreUserType: getUserTypeFromIdentity,
		formIsValid:
			() =>
			(_dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) =>
				withDeliveryFormIsValid(getState()),
		submitForm:
			() =>
			(dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) =>
				submitWithDeliveryForm(dispatch, getState()),
		signOut,
		setBillingCountry,
		validateForm:
			() =>
			(dispatch: SubscriptionsDispatch, getState: () => SubscriptionsState) => {
				const state = getState();
				validateWithDeliveryForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkoutForm.payment;

				if (paymentMethod.name === PayPal) {
					trackSubmitAttempt(PayPal, GuardianWeekly, NoProductOptions);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
		setCsrCustomerData: (customerData: CsrCustomerData) =>
			setCsrCustomerData('delivery', customerData),
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

type PropTypes = ConnectedProps<typeof connector>;

// ----- Form Fields ----- //
const days = getWeeklyDays();

// ----- Component ----- //
function WeeklyCheckoutForm(props: PropTypes) {
	useCsrCustomerData(props.setCsrCustomerData);

	useEffect(() => {
		/**
		 * Rewrite the price (cart value) to report to QM
		 * for users inThreeTierTestVariant as the original props.price
		 * object doesn't account for the addition of S+ and associated promotions.
		 */
		const priceForQuantumMetric: ProductPrice = inThreeTierVariant
			? {
					...props.price,
					promotions: [],
					price: discountedDigitalPlusPrintPrice,
			  }
			: props.price;

		sendEventSubscriptionCheckoutStart(
			props.product,
			false,
			priceForQuantumMetric,
			props.billingPeriod,
		);
		inThreeTierVariant && props.setPaymentMethod({ paymentMethod: 'Stripe' });
	}, []);

	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry, there was a problem'
			: 'Sorry, we could not process your payment';

	const setBillingAddressMatchesDeliveryHandler = (newState: boolean) => {
		props.setBillingAddressMatchesDelivery(newState);
		props.setBillingCountry(props.deliveryCountry);
	};

	const inThreeTierVariant = props.participations.threeTierCheckout
		? props.participations.threeTierCheckout === 'variant' ||
		  props.participations.threeTierCheckoutV2 === 'variantA' ||
		  props.participations.threeTierCheckoutV2 === 'variantB'
		: false;

	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.billingCountry,
	);

	/**
	 * PayPal is not supported as a payment method for users
	 * inThreeTierTestVariant, so remove it from paymentMethods
	 * array.
	 **/
	if (inThreeTierVariant) {
		const paypalIndex = paymentMethods.findIndex(
			(subscriptionPaymentMethod) => subscriptionPaymentMethod === 'PayPal',
		);

		if (paypalIndex !== -1) {
			paymentMethods.splice(paypalIndex);
		}
	}

	const tierBillingPeriod = props.billingPeriod === 'Annual' ? 'year' : 'month';
	const tierBillingPeriodName =
		props.billingPeriod === 'Annual' ? 'annual' : 'monthly';

	const standardDigitalPlusPrintPrice =
		tierCards.tier3.plans[tierBillingPeriodName].charges[props.countryGroupId]
			.price;
	const digitalPlusPrintPotentialDiscount =
		tierCards.tier3.plans[tierBillingPeriodName].charges[props.countryGroupId]
			.discount;
	const discountedDigitalPlusPrintPrice =
		digitalPlusPrintPotentialDiscount?.price ?? standardDigitalPlusPrintPrice;

	const publicationStartDays = days.filter((day) => {
		const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
		const date = formatMachineDate(day);
		return !invalidPublicationDates.some((dateSuffix) =>
			date.endsWith(dateSuffix),
		);
	});

	const potentialDiscount = digitalPlusPrintPotentialDiscount
		? {
				total: digitalPlusPrintPotentialDiscount.price,
				duration: digitalPlusPrintPotentialDiscount.duration.value,
				period: recurringContributionPeriodMap[
					digitalPlusPrintPotentialDiscount.duration.period
				] as 'month' | 'year',
		  }
		: undefined;

	return (
		<Content>
			<Layout
				asideNoBorders={inThreeTierVariant}
				aside={
					<>
						{inThreeTierVariant ? (
							<DigitalPlusPrintSummary
								total={standardDigitalPlusPrintPrice}
								currencySymbol={currencies[props.price.currency].glyph}
								paymentFrequency={tierBillingPeriod}
								discount={potentialDiscount}
								startDateGW={formatUserDate(publicationStartDays[0])}
							/>
						) : (
							<Summary
								image={
									<GridImage
										gridId="checkoutPackshotWeekly"
										srcSizes={[500]}
										sizes="(max-width: 740px) 50vw, 548"
										imgType="png"
										altText=""
									/>
								}
								title="Guardian Weekly"
								description=""
								productPrice={props.price}
								billingPeriod={props.billingPeriod}
								changeSubscription={routes.guardianWeeklySubscriptionLanding}
								product={props.product}
							/>
						)}
					</>
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
					<FormSection title="Where should we deliver your magazine?">
						<DeliveryAddress countries={gwDeliverableCountries} />
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
									onChange={() => setBillingAddressMatchesDeliveryHandler(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressMatchesDelivery"
									checked={!props.billingAddressMatchesDelivery}
									onChange={() =>
										setBillingAddressMatchesDeliveryHandler(false)
									}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{!props.billingAddressMatchesDelivery ? (
						<FormSection title="Your billing address">
							<BillingAddress countries={billableCountries} />
						</FormSection>
					) : null}
					{!inThreeTierVariant && (
						<FormSection title="Please select the first publication you’d like to receive">
							<Rows>
								<RadioGroup
									id="startDate"
									error={firstError('startDate', props.formErrors)}
									label="Please select the first publication you’d like to receive"
									hideLabel={true}
								>
									{publicationStartDays.map((day) => {
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
					)}
					{!inThreeTierVariant && (
						<BillingPeriodSelector
							fulfilmentOption={props.fulfilmentOption}
							onChange={(billingPeriod) =>
								props.setBillingPeriod(billingPeriod)
							}
							billingPeriods={weeklyBillingPeriods()}
							pricingCountry={props.deliveryCountry}
							productPrices={props.productPrices}
							selected={props.billingPeriod}
						/>
					)}
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
							country={props.deliveryCountry}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							// @ts-expect-error TODO: fix when we can fix error states for all checkouts
							allErrors={[
								...props.billingAddressErrors,
								...props.deliveryAddressErrors,
								...props.formErrors,
							]}
							name={`${props.firstName} ${props.lastName}`}
							validateForm={props.validateForm}
							buttonText={
								inThreeTierVariant
									? `Pay ${currencies[props.price.currency].glyph}${
											digitalPlusPrintPotentialDiscount?.price ??
											standardDigitalPlusPrintPrice
									  } per ${tierBillingPeriod}`
									: 'Pay now'
							}
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
							amount={props.discountedPrice.price}
							billingPeriod={props.billingPeriod}
							// @ts-expect-error TODO: fix when we can fix error states for all checkouts
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
					{inThreeTierVariant ? (
						<Total
							price={
								digitalPlusPrintPotentialDiscount?.price ??
								standardDigitalPlusPrintPrice
							}
							currency={props.currencyId}
						/>
					) : (
						<Total
							price={props.discountedPrice.price}
							currency={props.currencyId}
						/>
					)}

					{inThreeTierVariant ? (
						<ThreeTierTerms
							paymentMethod={props.paymentMethod}
							paymentFrequency={tierBillingPeriod}
						/>
					) : (
						<PaymentTerms paymentMethod={props.paymentMethod} />
					)}
				</Form>
			</Layout>
		</Content>
	);
} // ----- Exports ----- //

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(WeeklyCheckoutForm);
