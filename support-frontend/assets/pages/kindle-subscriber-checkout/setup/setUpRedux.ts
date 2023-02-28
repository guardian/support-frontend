// ----- Imports ----- //
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
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { setBillingState } from 'helpers/redux/checkout/address/actions';
import { getExistingPaymentMethods } from 'helpers/redux/checkout/payment/existingPaymentMethods/thunks';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import {
	setEmail,
	setUserTypeFromIdentityResponse,
} from 'helpers/redux/checkout/personalDetails/actions';
import { getUserTypeFromIdentity } from 'helpers/redux/checkout/personalDetails/thunks';
import {
	setAllAmounts,
	setOtherAmount,
	setProductType,
} from 'helpers/redux/checkout/product/actions';
import { setContributionTypes } from 'helpers/redux/commonState/actions';
import type {
	ContributionsDispatch,
	ContributionsState,
	ContributionsStore,
} from 'helpers/redux/contributionsStore';
import { getRecurringContributorStatus } from 'helpers/redux/user/thunks';
import * as storage from 'helpers/storage/storage';
import { setUpUserState } from 'helpers/user/reduxSetup';
import { getUserStateField } from 'helpers/user/user';

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

function selectInitialAmounts(
	state: ContributionsState,
	dispatch: ContributionsDispatch,
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
		setAllAmounts({
			...defaults,
			[selectedContributionType]: selectedAmount,
		}),
	);

	if (otherAmount) {
		dispatch(
			setOtherAmount({
				amount: `${otherAmount}`,
				contributionType: selectedContributionType,
			}),
		);
	}
}

// Override the settings from the server if contributionTypes are defined in url params or campaign settings
function getContributionTypes(state: ContributionsState): ContributionTypes {
	const campaignSettings = getCampaignSettings();

	if (campaignSettings?.contributionTypes) {
		return campaignSettings.contributionTypes;
	}

	return getValidContributionTypesFromUrlOrElse(
		state.common.settings.contributionTypes,
	);
}

function selectInitialContributionTypeAndPaymentMethod(
	state: ContributionsState,
	dispatch: ContributionsDispatch,
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
	dispatch(setProductType('DigitalPack'));
	dispatch(setPaymentMethod(paymentMethod));

	return contributionType;
}

export function setUpRedux(store: ContributionsStore): void {
	const dispatch = store.dispatch;
	const state = store.getState();
	// TODO - move these settings out of the redux store, as they only change once, upon initialisation
	const contributionTypes = getContributionTypes(state);
	dispatch(setContributionTypes(contributionTypes));

	setUpUserState(dispatch);
	void dispatch(getRecurringContributorStatus());

	const sessionStorageEmail = storage.getSession('gu.email');
	if (sessionStorageEmail) {
		dispatch(setEmail(sessionStorageEmail));
	}

	void dispatch(getExistingPaymentMethods());
	const contributionType = selectInitialContributionTypeAndPaymentMethod(
		state,
		dispatch,
		contributionTypes,
	);
	selectInitialAmounts(state, dispatch, contributionType);

	// For PayPal one-off we need to get userType from session after the thankyou page redirect
	const userType = storage.getSession('userTypeFromIdentityResponse');

	if (
		userType &&
		(userType === 'new' || userType === 'guest' || userType === 'current')
	) {
		dispatch(setUserTypeFromIdentityResponse(userType));
	} else if (sessionStorageEmail) {
		void dispatch(getUserTypeFromIdentity(sessionStorageEmail));
	}

	const stateField = getUserStateField();
	if (stateField) {
		dispatch(setBillingState(stateField));
	}
}
