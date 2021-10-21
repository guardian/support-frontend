// ----- Imports ----- //
import React from 'react';
import { connect } from 'react-redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import { onFormSubmit } from 'helpers/checkoutForm/onFormSubmit';
import { getAmount, logInvalidCombination } from 'helpers/contributions';
import type {
	ContributionAmounts,
	ContributionType,
	OtherAmounts,
	PaymentMatrix,
	SelectedAmounts,
	ThirdPartyPaymentLibraries,
} from 'helpers/contributions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { CreatePaypalPaymentData } from 'helpers/forms/paymentIntegrations/oneOffContributions';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import 'helpers/forms/errorReasons';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
import 'helpers/forms/paymentIntegrations/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { payPalCancelUrl, payPalReturnUrl } from 'helpers/urls/routes';
import {
	setCurrencyId,
	setUseLocalAmounts,
	setUseLocalCurrencyFlag,
} from '../../../helpers/page/commonActions';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import 'helpers/identityApis';
import ContributionAmount from './ContributionAmount';
import ContributionFormFields from './ContributionFormFields';
import ContributionSubmit from './ContributionSubmit';
import ContributionTypeTabs from './ContributionTypeTabs';
import PaymentMethodSelector from './PaymentMethodSelector';
import type {
	SepaData,
	State,
} from 'pages/contributions-landing/contributionsLandingReducer';
import 'pages/contributions-landing/contributionsLandingReducer';
import {
	createOneOffPayPalPayment,
	paymentWaiting,
	selectAmount,
	setCheckoutFormHasBeenSubmitted,
	setSepaAccountHolderName,
	setSepaIban,
} from 'pages/contributions-landing/contributionsLandingActions';
import ContributionErrorMessage from './ContributionErrorMessage';
import StripeCardFormContainer from './StripeCardForm/StripeCardFormContainer';
import StripePaymentRequestButtonContainer from './StripePaymentRequestButton/StripePaymentRequestButtonContainer';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Sepa,
} from 'helpers/forms/paymentMethods';
import { logException } from 'helpers/utilities/logger';
import { Checkbox, CheckboxGroup } from '@guardian/src-checkbox';
import type { LocalCurrencyCountry } from 'helpers/internationalisation/localCurrencyCountry';
import { SepaForm } from 'pages/contributions-landing/components/SepaForm';
import SepaTerms from 'components/legal/termsPrivacy/sepaTerms';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	isWaiting: boolean;
	countryGroupId: CountryGroupId;
	email: string;
	otherAmounts: OtherAmounts;
	paymentMethod: PaymentMethod;
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod;
	thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries;
	contributionType: ContributionType;
	currency: IsoCurrency;
	paymentError: ErrorReason | null;
	selectedAmounts: SelectedAmounts;
	setPaymentIsWaiting: (arg0: boolean) => void;
	openDirectDebitPopUp: () => void;
	createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void;
	setCheckoutFormHasBeenSubmitted: () => void;
	onPaymentAuthorisation: (arg0: PaymentAuthorisation) => void;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	isSignedIn: boolean;
	formIsValid: boolean;
	isPostDeploymentTestUser: boolean;
	formIsSubmittable: boolean;
	isTestUser: boolean;
	country: IsoCountry;
	createStripePaymentMethod: (clientSecret: string | null) => void;
	stripeClientSecret: string | null;
	amazonPayOrderReferenceId: string | null;
	checkoutFormHasBeenSubmitted: boolean;
	campaignSettings: CampaignSettings | null;
	amazonPayBillingAgreementId?: string;
	localCurrencyCountry?: LocalCurrencyCountry;
	amounts: ContributionAmounts;
	useLocalCurrency: boolean;
	setUseLocalCurrency: (
		arg0: boolean,
		arg1?: LocalCurrencyCountry,
		arg2?: number,
	) => void;
	defaultOneOffAmount: number | null;
	sepaData: SepaData;
	setSepaIban: (arg0: string) => void;
	setSepaAccountHolderName: (arg0: string) => void;
	productSetAbTestVariant: boolean;
};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null => (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */
const mapStateToProps = (state: State) => ({
	isWaiting: state.page.form.isWaiting,
	countryGroupId: state.common.internationalisation.countryGroupId,
	email: getCheckoutFormValue(
		state.page.form.formData.email,
		state.page.user.email,
	),
	otherAmounts: state.page.form.formData.otherAmounts,
	paymentMethod: state.page.form.paymentMethod,
	existingPaymentMethod: state.page.form.existingPaymentMethod,
	thirdPartyPaymentLibraries: state.page.form.thirdPartyPaymentLibraries,
	createStripePaymentMethod:
		state.page.form.stripeCardFormData.createPaymentMethod,
	stripeClientSecret:
		state.page.form.stripeCardFormData.setupIntentClientSecret,
	contributionType: state.page.form.contributionType,
	paymentError: state.page.form.paymentError,
	selectedAmounts: state.page.form.selectedAmounts,
	userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
	isSignedIn: state.page.user.isSignedIn,
	formIsValid: state.page.form.formIsValid,
	isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
	formIsSubmittable: state.page.form.formIsSubmittable,
	isTestUser: state.page.user.isTestUser || false,
	country: state.common.internationalisation.countryId,
	amazonPayOrderReferenceId: state.page.form.amazonPayData.orderReferenceId,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	amazonPayBillingAgreementId:
		state.page.form.amazonPayData.amazonBillingAgreementId,
	localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
	currency: state.common.internationalisation.currencyId,
	amounts: state.common.amounts,
	defaultOneOffAmount: state.common.defaultAmounts.ONE_OFF.defaultAmount,
	sepaData: state.page.form.sepaData,
	productSetAbTestVariant:
		state.common.abParticipations.productSetTest === 'variant',
});

const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
	setPaymentIsWaiting: (isWaiting) => {
		dispatch(paymentWaiting(isWaiting));
	},
	openDirectDebitPopUp: () => {
		dispatch(openDirectDebitPopUp());
	},
	setCheckoutFormHasBeenSubmitted: () => {
		dispatch(setCheckoutFormHasBeenSubmitted());
	},
	createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => {
		dispatch(createOneOffPayPalPayment(data));
	},
	setUseLocalCurrency: (
		useLocalCurrency,
		localCurrencyCountry,
		defaultOneOffAmount,
	) => {
		dispatch(setUseLocalCurrencyFlag(useLocalCurrency));
		dispatch(setCurrencyId(useLocalCurrency));
		dispatch(setUseLocalAmounts(useLocalCurrency));
		dispatch(
			selectAmount(
				useLocalCurrency
					? localCurrencyCountry.amounts.ONE_OFF.defaultAmount
					: defaultOneOffAmount,
				'ONE_OFF',
			),
		);
	},
	setSepaIban: (iban) => {
		dispatch(setSepaIban(iban));
	},
	setSepaAccountHolderName: (name) => {
		dispatch(setSepaAccountHolderName(name));
	},
});

// Bizarrely, adding a type to this object means the type-checking on the
// formHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const formHandlersForRecurring = {
	PayPal: () => {
		// we don't get an onSubmit event for PayPal recurring, so there
		// is no need to handle anything here
	},
	Stripe: (props: PropTypes) => {
		if (props.createStripePaymentMethod) {
			props.createStripePaymentMethod(props.stripeClientSecret);
		}
	},
	DirectDebit: (props: PropTypes) => {
		props.openDirectDebitPopUp();
	},
	Sepa: (props: PropTypes) => {
		const { accountHolderName, iban } = props.sepaData;

		if (accountHolderName && iban) {
			props.onPaymentAuthorisation({
				paymentMethod: 'Sepa',
				accountHolderName,
				iban,
			});
		}
	},
	ExistingCard: (props: PropTypes) =>
		props.onPaymentAuthorisation({
			paymentMethod: 'ExistingCard',
			billingAccountId: props.existingPaymentMethod.billingAccountId,
		}),
	ExistingDirectDebit: (props: PropTypes) =>
		props.onPaymentAuthorisation({
			paymentMethod: 'ExistingDirectDebit',
			billingAccountId: props.existingPaymentMethod.billingAccountId,
		}),
	AmazonPay: (props: PropTypes) => {
		if (props.amazonPayBillingAgreementId) {
			props.onPaymentAuthorisation({
				paymentMethod: 'AmazonPay',
				amazonPayBillingAgreementId: props.amazonPayBillingAgreementId,
			});
		}
	},
};
const formHandlers: PaymentMatrix<(arg0: PropTypes) => void> = {
	ONE_OFF: {
		Stripe: (props: PropTypes) => {
			if (props.createStripePaymentMethod) {
				props.createStripePaymentMethod(null);
			}
		},
		PayPal: (props: PropTypes) => {
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
		AmazonPay: (props: PropTypes) => {
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
function onSubmit(props: PropTypes): (arg0: Event) => void {
	return (event) => {
		// Causes errors to be displayed against payment fields
		event.preventDefault();
		const flowPrefix = 'npf';
		const form = event.target;

		const handlePayment = () =>
			formHandlers[props.contributionType][props.paymentMethod](props);

		onFormSubmit({ ...props, flowPrefix, handlePayment, form });
	};
}

// ----- Render ----- //
function ContributionForm(props: PropTypes) {
	const baseClass = 'form';
	const classModifiers = ['contribution', 'with-labels'];

	function toggleUseLocalCurrency() {
		props.setUseLocalCurrency(
			!props.useLocalCurrency,
			props.localCurrencyCountry,
			props.defaultOneOffAmount,
		);
	}

	return (
		<form
			onSubmit={onSubmit(props)}
			className={classNameWithModifiers(baseClass, classModifiers)}
			noValidate
		>
			<h2 className="hidden-heading">Make a contribution</h2>
			<div className="contributions-form-selectors">
				<ContributionTypeTabs />
				<ContributionAmount />
				{props.localCurrencyCountry && props.contributionType === 'ONE_OFF' && (
					<CheckboxGroup cssOverrides="margin-top:16px;">
						<Checkbox
							label={`View in local currency (${props.localCurrencyCountry.currency})`}
							defaultChecked={props.useLocalCurrency}
							onChange={toggleUseLocalCurrency}
						/>
					</CheckboxGroup>
				)}
			</div>
			<StripePaymentRequestButtonContainer
				currency={props.currency}
				contributionType={props.contributionType}
				isTestUser={props.isTestUser}
				country={props.country}
				otherAmounts={props.otherAmounts}
				selectedAmounts={props.selectedAmounts}
			/>
			<div className={classNameWithModifiers('form', ['content'])}>
				<ContributionFormFields />
				<PaymentMethodSelector />

				{props.paymentMethod === Sepa && (
					<>
						<SepaForm
							iban={props.sepaData.iban}
							accountHolderName={props.sepaData.accountHolderName}
							updateIban={props.setSepaIban}
							updateAccountHolderName={props.setSepaAccountHolderName}
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
				/>

				<div>
					<ContributionErrorMessage />
				</div>

				<ContributionSubmit
					onPaymentAuthorisation={props.onPaymentAuthorisation}
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
			/>
			{props.isWaiting ? (
				<ProgressMessage message={['Processing transaction', 'Please wait']} />
			) : null}
		</form>
	);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
