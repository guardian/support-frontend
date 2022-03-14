// ----- Imports ----- //
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Store } from 'redux';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import type {
	ContributionType,
	ContributionTypes,
} from 'helpers/contributions';
import {
	getAmountFromUrl,
	getContributionTypeFromSession,
	getContributionTypeFromUrl,
	getPaymentMethodFromSession,
	getValidContributionTypesFromUrlOrElse,
	getValidPaymentMethods,
} from 'helpers/forms/checkouts';
import {
	isUsableExistingPaymentMethod,
	mapExistingPaymentMethodToPaymentMethod,
	sendGetExistingPaymentMethodsRequest,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { ExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { AmazonPay, PayPal } from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	setContributionTypes,
	setExistingPaymentMethods,
} from 'helpers/redux/commonState/actions';
import * as storage from 'helpers/storage/storage';
import { getQueryParameter } from 'helpers/urls/url';
import { doesUserAppearToBeSignedIn } from 'helpers/user/user';
import { loadRecaptchaV2 } from '../../helpers/forms/recaptcha';
import type { Action } from './contributionsLandingActions';
import {
	getUserType,
	loadAmazonPaySdk,
	loadPayPalExpressSdk,
	selectAmount,
	selectAmounts,
	setUserTypeFromIdentityResponse,
	updateContributionTypeAndPaymentMethod,
	updateOtherAmount,
	updatePaymentMethod,
	updateSelectedExistingPaymentMethod,
	updateUserFormData,
} from './contributionsLandingActions';
import type { State } from './contributionsLandingReducer';

// ----- Functions ----- //
function getInitialPaymentMethod(
	contributionType: ContributionType,
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
	switches: Switches,
): PaymentMethod {
	const paymentMethodFromSession = getPaymentMethodFromSession();
	const validPaymentMethods = getValidPaymentMethods(
		contributionType,
		switches,
		countryId,
		countryGroupId,
	);

	if (
		paymentMethodFromSession &&
		validPaymentMethods.includes(paymentMethodFromSession)
	) {
		return paymentMethodFromSession;
	}

	return 'None';
}

function getInitialContributionType(
	countryGroupId: CountryGroupId,
	contributionTypes: ContributionTypes,
): ContributionType {
	const contributionType =
		getContributionTypeFromUrl() ?? getContributionTypeFromSession();

	// make sure we don't select a contribution type which isn't on the page
	if (
		contributionType &&
		contributionTypes[countryGroupId].find(
			(ct) => ct.contributionType === contributionType,
		)
	) {
		return contributionType;
	}

	const defaultContributionType = contributionTypes[countryGroupId].find(
		(ct) => ct.isDefault,
	);
	return defaultContributionType
		? defaultContributionType.contributionType
		: contributionTypes[countryGroupId][0].contributionType;
}

function initialisePaymentMethods(
	state: State,
	dispatch: (...args: any[]) => any,
) {
	const { currencyId } = state.common.internationalisation;
	// initiate fetch of existing payment methods
	const userAppearsLoggedIn = doesUserAppearToBeSignedIn();
	const existingDirectDebitON = isSwitchOn(
		'recurringPaymentMethods.existingDirectDebit',
	);
	const existingCardON = isSwitchOn('recurringPaymentMethods.existingCard');
	const existingPaymentsEnabledViaUrlParam =
		getQueryParameter('displayExistingPaymentOptions') === 'true';

	if (
		userAppearsLoggedIn &&
		(existingCardON || existingDirectDebitON) &&
		existingPaymentsEnabledViaUrlParam
	) {
		sendGetExistingPaymentMethodsRequest(
			currencyId,
			(allExistingPaymentMethods: ExistingPaymentMethod[]) => {
				const switchedOnExistingPaymentMethods =
					allExistingPaymentMethods.filter(
						(existingPaymentMethod) =>
							(existingPaymentMethod.paymentType === 'Card' &&
								existingCardON) ||
							(existingPaymentMethod.paymentType === 'DirectDebit' &&
								existingDirectDebitON),
					);
				dispatch(setExistingPaymentMethods(switchedOnExistingPaymentMethods));
				const firstExistingPaymentMethod = switchedOnExistingPaymentMethods[0];
				const allowDefaultSelectedPaymentMethod =
					state.common.abParticipations.defaultPaymentMethodTest === 'control';

				if (
					allowDefaultSelectedPaymentMethod &&
					isUsableExistingPaymentMethod(firstExistingPaymentMethod)
				) {
					dispatch(
						updatePaymentMethod(
							mapExistingPaymentMethodToPaymentMethod(
								firstExistingPaymentMethod,
							),
						),
					);
					dispatch(
						updateSelectedExistingPaymentMethod(firstExistingPaymentMethod),
					);
				}
			},
		);
	} else {
		dispatch(setExistingPaymentMethods([]));
	}
}

function selectInitialAmounts(
	state: State,
	dispatch: (...args: any[]) => any,
	selectedContributionType: ContributionType,
) {
	const { amounts } = state.common;
	const amountFromUrl = getAmountFromUrl();

	const amountForSelectedContributionType = () => {
		if (!amountFromUrl) {
			return {
				amount: amounts[selectedContributionType].defaultAmount,
			};
		}

		if (amountFromUrl == 'other') {
			return { amount: 'other' };
		}

		if (amounts[selectedContributionType].amounts.includes(amountFromUrl)) {
			return { amount: amountFromUrl };
		}

		// This means there is a query parameter specifying an amount,
		// but that amount isn't available as one of the choice cards.
		// In this case we want to select the 'other' choice card
		// and additionally  prefill the 'other' field with the amount.
		return { amount: 'other', otherAmount: amountFromUrl };
	};

	const defaults = {
		ONE_OFF: amounts.ONE_OFF.defaultAmount,
		MONTHLY: amounts.MONTHLY.defaultAmount,
		ANNUAL: amounts.ANNUAL.defaultAmount,
	};

	const { amount: selectedAmount, otherAmount } =
		amountForSelectedContributionType();

	dispatch(
		selectAmounts({
			...defaults,
			[selectedContributionType]: selectedAmount,
		}),
	);

	if (otherAmount) {
		dispatch(updateOtherAmount(`${otherAmount}`, selectedContributionType));
	}
}

// Override the settings from the server if contributionTypes are defined in url params or campaign settings
function getContributionTypes(state: State): ContributionTypes {
	const campaignSettings = getCampaignSettings();

	if (campaignSettings?.contributionTypes) {
		return campaignSettings.contributionTypes;
	}

	return getValidContributionTypesFromUrlOrElse(
		state.common.settings.contributionTypes,
	);
}

function selectInitialContributionTypeAndPaymentMethod(
	state: State,
	dispatch: (...args: any[]) => any,
	contributionTypes: ContributionTypes,
): ContributionType {
	const { countryId } = state.common.internationalisation;
	const { switches } = state.common.settings;
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getInitialContributionType(
		countryGroupId,
		contributionTypes,
	);
	const paymentMethod = getInitialPaymentMethod(
		contributionType,
		countryId,
		countryGroupId,
		switches,
	);
	dispatch(
		updateContributionTypeAndPaymentMethod(contributionType, paymentMethod),
	);

	switch (paymentMethod) {
		case PayPal:
			dispatch(loadPayPalExpressSdk(contributionType));
			break;

		case AmazonPay:
			dispatch(
				loadAmazonPaySdk(countryGroupId, state.page.user.isTestUser ?? false),
			);
			break;

		default:
	}

	return contributionType;
}

const init = (
	store: Store<State, Action | PayloadAction<ContributionTypes>>,
) => {
	const { dispatch } = store;
	const state = store.getState();
	// TODO - move these settings out of the redux store, as they only change once, upon initialisation
	const contributionTypes = getContributionTypes(state);
	dispatch(setContributionTypes(contributionTypes));
	initialisePaymentMethods(state, dispatch);
	const contributionType = selectInitialContributionTypeAndPaymentMethod(
		state,
		dispatch,
		contributionTypes,
	);
	selectInitialAmounts(state, dispatch, contributionType);
	const { firstName, lastName, email, stateField } = state.page.user;
	// For PayPal one-off we need to get userType from session after the thankyou page redirect
	const userType = storage.getSession('userTypeFromIdentityResponse');

	if (
		userType &&
		(userType === 'new' || userType === 'guest' || userType === 'current')
	) {
		dispatch(setUserTypeFromIdentityResponse(userType));
	} else {
		dispatch(getUserType(email));
	}

	dispatch(
		updateUserFormData({
			firstName,
			lastName,
			email,
			billingState: stateField,
		}),
	);
	void loadRecaptchaV2();
};

// ----- Exports ----- //
export { init };
