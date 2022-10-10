// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { contributionTypeIsRecurring, getAmount } from 'helpers/contributions';
import {
	amountOrOtherAmountIsValid,
	checkEmail,
	checkFirstName,
	checkLastName,
	checkStateIfApplicable,
	isValidIban,
} from 'helpers/forms/formValidation';
import { AmazonPay, Sepa } from 'helpers/forms/paymentMethods';
import { stripeCardFormIsIncomplete } from 'helpers/forms/stripe';
import type { StateProvince } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { Action as UserAction } from 'helpers/user/userActions';
import type { LocalCurrencyCountry } from '../../helpers/internationalisation/localCurrencyCountry';
import { getThresholdPrice } from './components/DigiSubBenefits/helpers';
import { setFormIsValid } from './contributionsLandingActions';
import type { Action as ContributionsLandingAction } from './contributionsLandingActions';

// ----- Types ----- //
type Action = ContributionsLandingAction | UserAction;

// ----- Functions ----- //
const enableOrDisablePayPalExpressCheckoutButton = (
	formIsSubmittable: boolean,
) => {
	if (formIsSubmittable && window.enablePayPalButton) {
		window.enablePayPalButton();
	} else if (window.disablePayPalButton) {
		window.disablePayPalButton();
	}
};

const setFormIsSubmittable = (
	formIsSubmittable: boolean,
	payPalButtonReady: boolean,
): Action => {
	if (payPalButtonReady) {
		enableOrDisablePayPalExpressCheckoutButton(formIsSubmittable);
	}

	return {
		type: 'SET_FORM_IS_SUBMITTABLE',
		formIsSubmittable,
	};
};

export type FormIsValidParameters = {
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	billingState: StateProvince | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	stripeCardFormOk: boolean;
	amazonPayFormOk: boolean;
	sepaFormOk: boolean;
	localCurrencyCountry?: LocalCurrencyCountry;
	useLocalCurrency?: boolean;
};

const getFormIsValid = (formIsValidParameters: FormIsValidParameters) => {
	const {
		selectedAmounts,
		otherAmounts,
		countryGroupId,
		contributionType,
		billingState,
		firstName,
		lastName,
		email,
		stripeCardFormOk,
		amazonPayFormOk,
		sepaFormOk,
		localCurrencyCountry,
		useLocalCurrency,
	} = formIsValidParameters;
	const hasNameFields = contributionType !== 'ONE_OFF';
	return (
		(hasNameFields
			? checkFirstName(firstName) && checkLastName(lastName)
			: true) &&
		checkEmail(email) &&
		stripeCardFormOk &&
		amazonPayFormOk &&
		sepaFormOk &&
		checkStateIfApplicable(billingState, countryGroupId, contributionType) &&
		amountOrOtherAmountIsValid(
			selectedAmounts,
			otherAmounts,
			contributionType,
			countryGroupId,
			localCurrencyCountry,
			useLocalCurrency,
		)
	);
};

const amazonPayFormOk = (state: ContributionsState): boolean => {
	if (state.page.checkoutForm.payment.paymentMethod === AmazonPay) {
		const {
			orderReferenceId,
			amazonBillingAgreementId,
			amazonBillingAgreementConsentStatus,
			paymentSelected,
		} = state.page.checkoutForm.payment.amazonPay;

		const oneOffOk = () => !!orderReferenceId;

		const recurringOk = () =>
			!!amazonBillingAgreementId && amazonBillingAgreementConsentStatus;

		return (
			paymentSelected &&
			(getContributionType(state) === 'ONE_OFF' ? oneOffOk() : recurringOk())
		);
	}

	return true;
};

const sepaFormOk = (state: ContributionsState): boolean => {
	if (state.page.checkoutForm.payment.paymentMethod === Sepa) {
		const { accountHolderName, iban } = state.page.checkoutForm.payment.sepa;
		return !!accountHolderName && isValidIban(iban);
	}

	return true;
};

const formIsValidParameters = (state: ContributionsState) => ({
	selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
	otherAmounts: state.page.checkoutForm.product.otherAmounts,
	countryGroupId: state.common.internationalisation.countryGroupId,
	contributionType: getContributionType(state),
	billingState: state.page.form.formData.billingState,
	firstName: state.page.checkoutForm.personalDetails.firstName,
	lastName: state.page.checkoutForm.personalDetails.lastName,
	email: state.page.checkoutForm.personalDetails.email,
	stripeCardFormOk: !stripeCardFormIsIncomplete(
		state.page.checkoutForm.payment.paymentMethod,
		state.page.checkoutForm.payment.stripe.formComplete,
	),
	amazonPayFormOk: amazonPayFormOk(state),
	sepaFormOk: sepaFormOk(state),
	localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

function enableOrDisableForm() {
	return (dispatch: Dispatch, getState: () => ContributionsState): void => {
		const state = getState();
		const { isRecurringContributor } = state.page.user;
		const contributionType = getContributionType(state);

		const thresholdPrice = getThresholdPrice(
			state.common.internationalisation.countryGroupId,
			contributionType,
		);
		const amount = getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		);
		const amountIsHighEnough = !!(thresholdPrice && amount >= thresholdPrice);
		const isSupporterPlus =
			state.common.abParticipations.newProduct == 'variant' &&
			amountIsHighEnough;

		const shouldBlockExistingRecurringContributor =
			!isSupporterPlus &&
			isRecurringContributor &&
			contributionTypeIsRecurring(contributionType);

		const formIsValid = getFormIsValid(formIsValidParameters(state));
		dispatch(setFormIsValid(formIsValid));
		const recaptchaRequired =
			window.guardian.recaptchaEnabled &&
			state.page.checkoutForm.payment.paymentMethod === 'Stripe' &&
			!state.page.user.isPostDeploymentTestUser;
		const recaptchaVerified = state.page.checkoutForm.recaptcha.completed;
		const shouldEnable =
			formIsValid &&
			!shouldBlockExistingRecurringContributor &&
			(!recaptchaRequired || recaptchaVerified);

		dispatch(
			setFormIsSubmittable(
				shouldEnable,
				state.page.checkoutForm.payment.payPal.buttonReady,
			),
		);
	};
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
	return (dispatch: Dispatch, getState: () => ContributionsState): void => {
		dispatch(setStateValue());
		enableOrDisableForm()(dispatch, getState);
	};
}

export { setFormSubmissionDependentValue, enableOrDisableForm };
