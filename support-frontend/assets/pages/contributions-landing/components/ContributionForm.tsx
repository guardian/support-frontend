// ----- Imports ----- //
import { css } from '@emotion/react';
import { Checkbox, CheckboxGroup } from '@guardian/source-react-components';
import { useState } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import SepaTerms from 'components/legal/termsPrivacy/sepaTerms';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import ProgressMessage from 'components/progressMessage/progressMessage';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import { getAmount, logInvalidCombination } from 'helpers/contributions';
import type { PaymentMatrix } from 'helpers/contributions';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Sepa,
} from 'helpers/forms/paymentMethods';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { setPopupOpen } from 'helpers/redux/checkout/payment/directDebit/actions';
import {
	setSepaAccountHolderName,
	setSepaAddressCountry,
	setSepaAddressStreetName,
	setSepaIban,
} from 'helpers/redux/checkout/payment/sepa/actions';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	setCurrencyId,
	setUseLocalAmounts,
	setUseLocalCurrencyFlag,
} from 'helpers/redux/commonState/actions';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import { SepaForm } from 'pages/contributions-landing/components/SepaForm';
import {
	createOneOffPayPalPayment,
	paymentWaiting,
	setCheckoutFormHasBeenSubmitted,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import ContributionAmount from './ContributionAmount';
import ContributionErrorMessage from './ContributionErrorMessage';
import ContributionFormFields from './ContributionFormFields';
import ContributionSubmit from './ContributionSubmit';
import ContributionTypeTabs from './ContributionTypeTabs';
import BenefitsBulletPoints from './DigiSubBenefits/BenefitsBulletPoints';
import BenefitsParagraph from './DigiSubBenefits/BenefitsParagraph';
import { shouldShowBenefitsMessaging } from './DigiSubBenefits/helpers';
import PaymentMethodSelector from './PaymentMethodSelector';
import StripeCardFormContainer from './StripeCardForm/StripeCardFormContainer';
import StripePaymentRequestButton from './StripePaymentRequestButton';

// ----- Types ----- //

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null => (formValue === null ? userValue : formValue);

const mapStateToProps = (state: State) => {
	const contributionType = getContributionType(state);
	return {
		isWaiting: state.page.form.isWaiting,
		countryGroupId: state.common.internationalisation.countryGroupId,
		email:
			getCheckoutFormValue(
				state.page.checkoutForm.personalDetails.email,
				state.page.user.email,
			) ?? '',
		otherAmounts: state.page.checkoutForm.product.otherAmounts,
		paymentMethod: state.page.form.paymentMethod,
		existingPaymentMethod: state.page.form.existingPaymentMethod,
		stripeClientSecret:
			state.page.form.stripeCardFormData.setupIntentClientSecret,
		contributionType,
		paymentError: state.page.form.paymentError,
		selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
		userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
		isSignedIn: state.page.user.isSignedIn,
		formIsValid: state.page.form.formIsValid,
		isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
		formIsSubmittable: state.page.form.formIsSubmittable,
		isTestUser: state.page.user.isTestUser ?? false,
		country: state.common.internationalisation.countryId,
		amazonPayOrderReferenceId:
			state.page.checkoutForm.payment.amazonPay.orderReferenceId,
		checkoutFormHasBeenSubmitted:
			state.page.form.formData.checkoutFormHasBeenSubmitted,
		amazonPayBillingAgreementId:
			state.page.checkoutForm.payment.amazonPay.amazonBillingAgreementId,
		localCurrencyCountry:
			state.common.internationalisation.localCurrencyCountry,
		useLocalCurrency: state.common.internationalisation.useLocalCurrency,
		currency: state.common.internationalisation.currencyId,
		amounts: state.common.amounts,
		defaultOneOffAmount: state.common.defaultAmounts.ONE_OFF.defaultAmount,
		sepa: state.page.checkoutForm.payment.sepa,
		productSetAbTestVariant:
			state.common.abParticipations.productSetTest === 'variant',
		benefitsMessagingAbTestBulletVariant:
			state.common.abParticipations.PP_V3 === 'V2_BULLET' &&
			contributionType !== 'ONE_OFF',
		benefitsMessagingAbTestParaVariant:
			state.common.abParticipations.PP_V3 === 'V1_PARAGRAPH' &&
			contributionType !== 'ONE_OFF',
	};
};

const mapDispatchToProps = {
	setPaymentIsWaiting: paymentWaiting,
	setPopupOpen,
	setCheckoutFormHasBeenSubmitted,
	createOneOffPayPalPayment,
	setUseLocalCurrencyFlag,
	setCurrencyId,
	setUseLocalAmounts,
	setSelectedAmount,
	setSepaIban,
	setSepaAccountHolderName,
	setSepaAddressStreetName,
	setSepaAddressCountry,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	campaignSettings: CampaignSettings | null;
	onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void;
};

// ----- Render ----- //
function ContributionForm(props: PropTypes): JSX.Element {
	const baseClass = 'form';
	const classModifiers = ['contribution', 'with-labels'];

	const showBenefitsMessaging = shouldShowBenefitsMessaging(
		props.contributionType,
		props.selectedAmounts,
		props.otherAmounts,
		props.countryGroupId,
	);
	const isAUDCountryGroup = props.countryGroupId === 'AUDCountries';

	function setUseLocalCurrency(
		useLocalCurrency: boolean,
		localCurrencyCountry: LocalCurrencyCountry | null | undefined,
		defaultOneOffAmount: number,
	) {
		const amount =
			useLocalCurrency && localCurrencyCountry
				? localCurrencyCountry.amounts.ONE_OFF.defaultAmount
				: defaultOneOffAmount;

		props.setUseLocalCurrencyFlag(useLocalCurrency);
		props.setCurrencyId(useLocalCurrency);
		props.setUseLocalAmounts(useLocalCurrency);
		props.setSelectedAmount({
			amount: amount.toString(),
			contributionType: 'ONE_OFF',
		});
	}

	function toggleUseLocalCurrency() {
		setUseLocalCurrency(
			!props.useLocalCurrency,
			props.localCurrencyCountry,
			props.defaultOneOffAmount,
		);
	}

	const [createStripePaymentMethod, setCreateStripePaymentMethod] = useState<
		((clientSecret: string | null) => void) | null
	>(null);

	const formHandlersForRecurring = {
		PayPal: () => {
			// we don't get an onSubmit event for PayPal recurring, so there
			// is no need to handle anything here
		},
		Stripe: () => {
			if (createStripePaymentMethod) {
				createStripePaymentMethod(props.stripeClientSecret);
			}
		},
		DirectDebit: () => {
			props.setPopupOpen();
		},
		Sepa: () => {
			const { accountHolderName, iban, country, streetName } = props.sepa;

			if (accountHolderName && iban) {
				props.onPaymentAuthorisation({
					paymentMethod: 'Sepa',
					accountHolderName,
					iban,
					country,
					streetName,
				});
			}
		},
		ExistingCard: () =>
			props.onPaymentAuthorisation({
				paymentMethod: 'ExistingCard',
				billingAccountId: props.existingPaymentMethod?.billingAccountId ?? '',
			}),
		ExistingDirectDebit: () =>
			props.onPaymentAuthorisation({
				paymentMethod: 'ExistingDirectDebit',
				billingAccountId: props.existingPaymentMethod?.billingAccountId ?? '',
			}),
		AmazonPay: () => {
			if (props.amazonPayBillingAgreementId) {
				props.onPaymentAuthorisation({
					paymentMethod: 'AmazonPay',
					amazonPayBillingAgreementId: props.amazonPayBillingAgreementId,
				});
			}
		},
	};
	const formHandlers: PaymentMatrix<() => void> = {
		ONE_OFF: {
			Stripe: () => {
				if (createStripePaymentMethod) {
					createStripePaymentMethod(null);
				}
			},
			PayPal: () => {
				props.setPaymentIsWaiting(true);
				props.createOneOffPayPalPayment({
					currency: props.currency,
					amount: getAmount(
						props.selectedAmounts,
						props.otherAmounts,
						props.contributionType,
					),
					returnURL: payPalReturnUrl(props.countryGroupId, props.email),
					cancelURL: payPalCancelUrl(props.countryGroupId),
				});
			},
			DirectDebit: () => {
				logInvalidCombination('ONE_OFF', DirectDebit);
			},
			Sepa: () => {
				logInvalidCombination('ONE_OFF', Sepa);
			},
			ExistingCard: () => {
				logInvalidCombination('ONE_OFF', ExistingCard);
			},
			ExistingDirectDebit: () => {
				logInvalidCombination('ONE_OFF', ExistingDirectDebit);
			},
			AmazonPay: () => {
				const { amazonPayOrderReferenceId } = props;

				if (amazonPayOrderReferenceId) {
					props.setPaymentIsWaiting(true);
					props.onPaymentAuthorisation({
						paymentMethod: AmazonPay,
						orderReferenceId: amazonPayOrderReferenceId,
					});
				} else {
					logException('Missing orderReferenceId for amazon pay');
				}
			},
			None: () => {
				logInvalidCombination('ONE_OFF', 'None');
			},
		},
		ANNUAL: {
			...formHandlersForRecurring,
			None: () => {
				logInvalidCombination('ANNUAL', 'None');
			},
		},
		MONTHLY: {
			...formHandlersForRecurring,
			None: () => {
				logInvalidCombination('MONTHLY', 'None');
			},
		},
	};

	// Note PayPal recurring flow does not call this function
	function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
		// Causes errors to be displayed against payment fields
		event.preventDefault();
		const flowPrefix = 'npf';
		const form = event.target;

		const handlePayment = () =>
			formHandlers[props.contributionType][props.paymentMethod]();

		onFormSubmit({ ...props, flowPrefix, handlePayment, form });
	}

	return (
		<form
			onSubmit={onSubmit}
			className={classNameWithModifiers(baseClass, classModifiers)}
			noValidate
		>
			<h2 className="hidden-heading">Make a contribution</h2>
			<div className="contributions-form-selectors">
				<ContributionTypeTabs />
				<ContributionAmount />
				{props.localCurrencyCountry && props.contributionType === 'ONE_OFF' && (
					<CheckboxGroup
						name="local-currency-toggle"
						cssOverrides={css`
							margin-top: 16px;
						`}
					>
						<Checkbox
							label={`View in local currency (${props.localCurrencyCountry.currency})`}
							value="local-currency"
							defaultChecked={props.useLocalCurrency}
							onChange={toggleUseLocalCurrency}
						/>
					</CheckboxGroup>
				)}
			</div>

			{props.benefitsMessagingAbTestBulletVariant && !isAUDCountryGroup && (
				<BenefitsBulletPoints
					showBenefitsMessaging={showBenefitsMessaging}
					countryGroupId={props.countryGroupId}
					contributionType={props.contributionType}
					setSelectedAmount={props.setSelectedAmount}
				/>
			)}
			{props.benefitsMessagingAbTestParaVariant && !isAUDCountryGroup && (
				<BenefitsParagraph
					showBenefitsMessaging={showBenefitsMessaging}
					countryGroupId={props.countryGroupId}
					contributionType={props.contributionType}
					setSelectedAmount={props.setSelectedAmount}
				/>
			)}

			<StripePaymentRequestButton
				contributionType={props.contributionType}
				isTestUser={props.isTestUser}
				country={props.country}
				amount={getAmount(
					props.selectedAmounts,
					props.otherAmounts,
					props.contributionType,
				)}
			/>
			<div className={classNameWithModifiers('form', ['content'])}>
				<ContributionFormFields />
				<PaymentMethodSelector />

				{props.paymentMethod === Sepa && (
					<>
						<SepaForm
							iban={props.sepa.iban}
							accountHolderName={props.sepa.accountHolderName}
							addressStreetName={props.sepa.streetName}
							addressCountry={props.sepa.country}
							updateIban={props.setSepaIban}
							updateAccountHolderName={props.setSepaAccountHolderName}
							updateAddressStreetName={props.setSepaAddressStreetName}
							updateAddressCountry={props.setSepaAddressCountry}
							checkoutFormHasBeenSubmitted={props.checkoutFormHasBeenSubmitted}
						/>
						<SepaTerms />
					</>
				)}

				<StripeCardFormContainer
					currency={props.currency}
					contributionType={props.contributionType}
					paymentMethod={props.paymentMethod}
					isTestUser={props.isTestUser}
					country={props.country}
					setCreateStripePaymentMethod={(create) => {
						// When passing a function to a `useState` setter, react invokes
						// the function and stores the return value. Given that we actually
						// want to store the `create` function as state, we need to wrap it
						// in a function first.
						setCreateStripePaymentMethod(() => create);
					}}
				/>

				<div>
					<ContributionErrorMessage />
				</div>

				<ContributionSubmit
					onPaymentAuthorisation={props.onPaymentAuthorisation}
					showBenefitsMessaging={showBenefitsMessaging}
					userInBenefitsVariant={
						props.benefitsMessagingAbTestBulletVariant ||
						props.benefitsMessagingAbTestParaVariant
					}
				/>
			</div>

			<TermsPrivacy
				countryGroupId={props.countryGroupId}
				contributionType={props.contributionType}
				campaignSettings={props.campaignSettings}
				currency={props.currency}
				amount={getAmount(
					props.selectedAmounts,
					props.otherAmounts,
					props.contributionType,
				)}
				userInBenefitsVariant={
					props.benefitsMessagingAbTestBulletVariant ||
					props.benefitsMessagingAbTestParaVariant
				}
			/>
			{props.isWaiting ? (
				<ProgressMessage message={['Processing transaction', 'Please wait']} />
			) : null}
		</form>
	);
}

export default connector(ContributionForm);
