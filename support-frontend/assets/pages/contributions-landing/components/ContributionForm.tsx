// ----- Imports ----- //
import { css } from '@emotion/react';
import { Checkbox, CheckboxGroup } from '@guardian/source-react-components';
import { useState } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import SepaTerms from 'components/legal/termsPrivacy/sepaTerms';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import ProgressMessage from 'components/progressMessage/progressMessage';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import {
	contributionTypeIsRecurring,
	getAmount,
	logInvalidCombination,
} from 'helpers/contributions';
import type { PaymentMatrix } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import {
	getFullExistingPaymentMethods,
	updateExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Sepa,
} from 'helpers/forms/paymentMethods';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { contributionsFormHasErrors } from 'helpers/redux/checkout/checkoutSelectors';
import { setPopupOpen } from 'helpers/redux/checkout/payment/directDebit/actions';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { loadPayPalExpressSdk } from 'helpers/redux/checkout/payment/payPal/reducer';
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
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import { SepaForm } from 'pages/contributions-landing/components/SepaForm';
import {
	createOneOffPayPalPayment,
	paymentWaiting,
	setCheckoutFormHasBeenSubmitted,
	updateSelectedExistingPaymentMethod,
} from 'pages/contributions-landing/contributionsLandingActions';
import ContributionAmount from './ContributionAmount';
import ContributionChoicesHeader from './ContributionChoicesHeader';
import ContributionErrorMessage from './ContributionErrorMessage';
import ContributionFormFields from './ContributionFormFields';
import ContributionSubmit from './ContributionSubmit';
import ContributionTypeTabs from './ContributionTypeTabs';
import BenefitsBulletPoints from './DigiSubBenefits/BenefitsBulletPoints';
import { shouldShowBenefitsMessaging } from './DigiSubBenefits/helpers';
import StripeCardFormContainer from './StripeCardForm/StripeCardFormContainer';
import StripePaymentRequestButton from './StripePaymentRequestButton';

// ----- Types ----- //

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null => (formValue === null ? userValue : formValue);

const mapStateToProps = (state: ContributionsState) => {
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
		paymentMethod: state.page.checkoutForm.payment.paymentMethod,
		existingPaymentMethod: state.page.form.existingPaymentMethod,
		existingPaymentMethods: state.common.existingPaymentMethods,
		stripeClientSecret:
			state.page.checkoutForm.payment.stripe.setupIntentClientSecret,
		contributionType,
		paymentError: state.page.form.paymentError,
		selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
		userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
		isSignedIn: state.page.user.isSignedIn,
		formIsValid: state.page.form.formIsValid,
		isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
		formIsSubmittable:
			state.page.form.formIsSubmittable && contributionsFormHasErrors(state),
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
		isInNewProductTest:
			state.common.abParticipations.newProduct === 'variant' &&
			contributionType !== 'ONE_OFF',
		switches: state.common.settings.switches,
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
	setPaymentMethod,
	updateSelectedExistingPaymentMethod,
	loadPayPalExpressSdk,
	validateForm,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector> & {
	campaignSettings: CampaignSettings | null;
	onPaymentAuthorisation: (paymentAuthorisation: PaymentAuthorisation) => void;
	payPalHasBegunLoading?: boolean;
	loadPayPalExpressSdk: () => void;
	checkoutFormHasBeenSubmitted: boolean;
};

function PaymentMethodSelectorLegend() {
	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			<legend id="payment_method">
				<ContributionChoicesHeader>Payment Method</ContributionChoicesHeader>
			</legend>
			<SecureTransactionIndicator modifierClasses={['middle']} />
		</div>
	);
}

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
		((clientSecret?: string) => void) | null
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
					createStripePaymentMethod();
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
		props.validateForm();

		const flowPrefix = 'npf';
		const form = event.target;

		const handlePayment = () =>
			formHandlers[props.contributionType][props.paymentMethod]();

		onFormSubmit({ ...props, flowPrefix, handlePayment, form });
	}

	const paymentMethods: PaymentMethod[] = getValidPaymentMethods(
		props.contributionType,
		props.switches,
		props.country,
		props.countryGroupId,
	);

	const onPaymentMethodUpdate = (paymentMethod: PaymentMethod) => {
		switch (paymentMethod) {
			case 'PayPal':
				if (!props.payPalHasBegunLoading) {
					void props.loadPayPalExpressSdk();
				}

				break;

			default:
		}

		props.setPaymentMethod(paymentMethod);
		props.updateSelectedExistingPaymentMethod(undefined);
	};

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

			{props.isInNewProductTest && (
				<BenefitsBulletPoints
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
				{paymentMethods.length > 0 ? (
					<FormSection
						titleComponent={<PaymentMethodSelectorLegend />}
						cssOverrides={css`
							padding: 0;
							margin-top: 1.25rem;
						`}
					>
						<PaymentMethodSelector
							availablePaymentMethods={paymentMethods}
							paymentMethod={props.paymentMethod}
							setPaymentMethod={onPaymentMethodUpdate}
							validationError={
								props.checkoutFormHasBeenSubmitted &&
								props.paymentMethod === 'None'
									? 'Please select a payment method'
									: undefined
							}
							fullExistingPaymentMethods={getFullExistingPaymentMethods(
								props.existingPaymentMethods,
							)}
							contributionTypeIsRecurring={contributionTypeIsRecurring(
								props.contributionType,
							)}
							existingPaymentMethod={props.existingPaymentMethod}
							existingPaymentMethods={props.existingPaymentMethods}
							updateExistingPaymentMethod={updateExistingPaymentMethod}
						/>
					</FormSection>
				) : (
					<GeneralErrorMessage
						classModifiers={['no-valid-payments']}
						errorHeading="Payment methods are unavailable"
						errorReason="all_payment_methods_unavailable"
					/>
				)}
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
					userInNewProductTest={props.isInNewProductTest}
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
				userInNewProductTest={props.isInNewProductTest}
			/>
			{props.isWaiting ? (
				<ProgressMessage message={['Processing transaction', 'Please wait']} />
			) : null}
		</form>
	);
}

export default connector(ContributionForm);
