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
import {
	BillingAddress,
	DeliveryAddress,
} from 'components/subscriptionCheckouts/address/scopedAddressFields';
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
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import { setBillingCountry } from 'helpers/redux/checkout/address/actions';
import { getUserTypeFromIdentity } from 'helpers/redux/checkout/personalDetails/thunks';
import { selectPriceForProduct } from 'helpers/redux/checkout/product/selectors/productPrice';
import type {
	SubscriptionsDispatch,
	SubscriptionsState,
} from 'helpers/redux/subscriptionsStore';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
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
import './weeklyCheckout.scss';

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
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkoutForm.product.productPrices,
		deliveryAddressErrors:
			state.page.checkoutForm.deliveryAddress.fields.errors,
		billingAddressErrors: state.page.checkoutForm.billingAddress.fields.errors,
		isTestUser: state.page.user.isTestUser,
		country: state.common.internationalisation.countryId,
		csrf: state.page.checkoutForm.csrf,
		currencyId:
			currencyFromCountryCode(deliveryAddress.fields.country) ??
			state.common.internationalisation.defaultCurrency,
		payPalHasLoaded: state.page.checkoutForm.payment.payPal.hasLoaded,
		price: selectPriceForProduct(state),
	};
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
	return {
		...formActionCreators,
		fetchAndStoreUserType: getUserTypeFromIdentity,
		formIsValid:
			() => (_: SubscriptionsDispatch, getState: () => SubscriptionsState) =>
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
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

// ----- Types ----- //
type PropTypes = ConnectedProps<typeof connector>;

// ----- Form Fields ----- //

const days = getWeeklyDays();

// ----- Component ----- //
function WeeklyCheckoutFormGifting(props: PropTypes): JSX.Element {
	useEffect(() => {
		sendEventSubscriptionCheckoutStart(
			props.product,
			true,
			props.price,
			props.billingPeriod,
		);
	}, []);

	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';

	const setBillingAddressMatchesDeliveryHandler = (newState: boolean) => {
		props.setBillingAddressMatchesDelivery(newState);
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
						productPrice={props.price}
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
							data-qm-masking="blocklist"
							label="Title"
							optional
							value={props.titleGiftRecipient ?? undefined}
							onChange={(e) => props.setTitleGift(e.target.value)}
						>
							<OptionForSelect>Select a title</OptionForSelect>
							{options(titles)}
						</Select>
						<PersonalDetailsGift
							firstNameGiftRecipient={props.firstNameGiftRecipient}
							setFirstNameGift={props.setFirstNameGift}
							lastNameGiftRecipient={props.lastNameGiftRecipient}
							setLastNameGift={props.setLastNameGift}
							emailGiftRecipient={props.emailGiftRecipient}
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
						<DeliveryAddress countries={weeklyDeliverableCountries} />
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
							data-qm-masking="blocklist"
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
								id="billingAddressMatchesDelivery"
								name="billingAddressMatchesDelivery"
								orientation="vertical"
								error={
									firstError(
										'billingAddressMatchesDelivery',
										props.formErrors,
									) as string
								}
							>
								<Radio
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
							<BillingAddress countries={countries} />
						</FormSection>
					) : null}
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
								validationError={
									firstError('paymentMethod', props.formErrors) as string
								}
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
							// @ts-expect-error TODO: Fixing the types around validation errors will affect every checkout, too much to tackle now
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
						price={props.price.price}
						currency={props.currencyId}
						promotions={props.price.promotions}
					/>
					<PaymentTerms orderIsAGift paymentMethod={props.paymentMethod} />
				</Form>
			</Layout>
		</Content>
	);
}

// ----- Exports ----- //
export default connector(WeeklyCheckoutFormGifting);
