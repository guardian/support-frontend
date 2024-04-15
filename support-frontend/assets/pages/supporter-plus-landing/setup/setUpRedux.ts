// ----- Imports ----- //
import type { ContributionType } from 'helpers/contributions';
import {
	getAmountFromUrl,
	getContributionTypeFromSession,
	getContributionTypeFromUrl,
	getPaymentMethodFromSession,
	getValidPaymentMethods,
} from 'helpers/forms/checkouts';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
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
	setBillingPeriod,
	setOtherAmount,
	setProductType,
} from 'helpers/redux/checkout/product/actions';
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
): PaymentMethod {
	const paymentMethodFromSession = getPaymentMethodFromSession();
	const validPaymentMethods = getValidPaymentMethods(
		contributionType,
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
	state: ContributionsState,
): ContributionType {
	const { defaultContributionType, displayContributionType } =
		state.common.amounts;

	const contributionType =
		getContributionTypeFromUrl() ?? getContributionTypeFromSession();

	// make sure we don't select a contribution type which isn't on the page
	if (contributionType && displayContributionType.includes(contributionType)) {
		return contributionType;
	}

	return defaultContributionType;
}

function selectInitialAmounts(
	state: ContributionsState,
	dispatch: ContributionsDispatch,
	selectedContributionType: ContributionType,
) {
	const { amounts } = state.common;
	const { amountsCardData } = amounts;
	const amountFromUrl = getAmountFromUrl();

	const amountForSelectedContributionType = () => {
		if (!amountFromUrl) {
			return {
				amount: amountsCardData[selectedContributionType].defaultAmount,
			};
		}

		if (amountFromUrl == 'other') {
			return { amount: 'other' };
		}

		if (
			amountsCardData[selectedContributionType].amounts.includes(amountFromUrl)
		) {
			return { amount: amountFromUrl };
		}

		// This means there is a query parameter specifying an amount,
		// but that amount isn't available as one of the choice cards.
		// In this case we want to select the 'other' choice card
		// and additionally  prefill the 'other' field with the amount.
		return { amount: 'other', otherAmount: amountFromUrl };
	};

	const defaults = {
		ONE_OFF: amountsCardData.ONE_OFF.defaultAmount,
		MONTHLY: amountsCardData.MONTHLY.defaultAmount,
		ANNUAL: amountsCardData.ANNUAL.defaultAmount,
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

function selectInitialContributionTypeAndPaymentMethod(
	state: ContributionsState,
	dispatch: ContributionsDispatch,
): ContributionType {
	const { countryId } = state.common.internationalisation;
	const { countryGroupId } = state.common.internationalisation;

	const contributionType = getInitialContributionType(state);
	const paymentMethod = getInitialPaymentMethod(
		contributionType,
		countryId,
		countryGroupId,
	);
	dispatch(setProductType(contributionType));
	dispatch(setPaymentMethod({ paymentMethod }));

	return contributionType;
}

export function setUpRedux(store: ContributionsStore): void {
	const dispatch = store.dispatch;
	const state = store.getState();

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
	);
	selectInitialAmounts(state, dispatch, contributionType);

	const billingPeriod = contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	dispatch(setBillingPeriod(billingPeriod));

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
