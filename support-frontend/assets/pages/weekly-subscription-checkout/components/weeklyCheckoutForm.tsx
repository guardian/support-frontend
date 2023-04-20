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
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import PaymentTerms from 'components/subscriptionCheckouts/paymentTerms';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import Summary from 'components/subscriptionCheckouts/summary';
import Total from 'components/subscriptionCheckouts/total/total';
import Text from 'components/text/text';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { currencyFromCountryCode } from 'helpers/internationalisation/currency';
import { weeklyDeliverableCountries } from 'helpers/internationalisation/weeklyDeliverableCountries';
import { weeklyBillingPeriods } from 'helpers/productPrice/billingPeriods';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setBillingCountry } from 'helpers/redux/checkout/address/actions';
import { getUserTypeFromIdentity } from 'helpers/redux/checkout/personalDetails/thunks';
import { selectPriceForProduct } from 'helpers/redux/checkout/product/selectors/productPrice';
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
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

// ----- Styles ----- //
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

// ----- Map State/Props ----- //
function mapStateToProps(state: SubscriptionsState) {
	const { billingAddress, deliveryAddress } = state.page.checkoutForm;
	const { billingAddressIsSame } = state.page.checkout;
	return {
		...getFormFields(state),
		billingCountry: billingAddressIsSame
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

	const setIsBillingAddressSameHandler = (newState: boolean) => {
		props.setIsBillingAddressSame(newState);
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
						<DeliveryAddress countries={weeklyDeliverableCountries} />
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
									onChange={() => setIsBillingAddressSameHandler(true)}
								/>

								<Radio
									id="qa-billing-address-different"
									label="No"
									value="no"
									name="billingAddressIsSame"
									checked={!props.billingAddressIsSame}
									onChange={() => setIsBillingAddressSameHandler(false)}
								/>
							</RadioGroup>
						</Rows>
					</FormSection>
					{!props.billingAddressIsSame ? (
						<FormSection title="Your billing address">
							<BillingAddress countries={weeklyDeliverableCountries} />
						</FormSection>
					) : null}
					<FormSection title="Please select the first publication you’d like to receive">
						<Rows>
							<RadioGroup
								id="startDate"
								error={firstError('startDate', props.formErrors)}
								label="Please select the first publication you’d like to receive"
								hideLabel={true}
							>
								{days
									.filter((day) => {
										const invalidPublicationDates = [
											'-12-24',
											'-12-25',
											'-12-30',
										];
										const date = formatMachineDate(day);
										return !invalidPublicationDates.some((dateSuffix) =>
											date.endsWith(dateSuffix),
										);
									})
									.map((day) => {
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
					<BillingPeriodSelector
						fulfilmentOption={props.fulfilmentOption}
						onChange={(billingPeriod) => props.setBillingPeriod(billingPeriod)}
						billingPeriods={weeklyBillingPeriods()}
						pricingCountry={props.deliveryCountry}
						productPrices={props.productPrices}
						selected={props.billingPeriod}
					/>
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
							amount={props.price.price}
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
					<Total
						price={props.price.price}
						currency={props.currencyId}
						promotions={props.price.promotions}
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
