import { shouldCollectStateForContributions } from 'helpers/internationalisation/shouldCollectStateForContribs';
import { isSupporterPlusPurchase } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { ErrorCollection } from './utils';

export function getStateOrProvinceError(
	state: ContributionsState,
): ErrorCollection {
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getContributionType(state);

	if (shouldCollectStateForContributions(countryGroupId, contributionType)) {
		return {
			state: state.page.checkoutForm.billingAddress.fields.errorObject?.state,
		};
	}
	return {};
}

export function getPersonalDetailsErrors(
	state: ContributionsState,
): ErrorCollection {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	const stateOrProvinceErrors = getStateOrProvinceError(state);

	if (contributionType === 'ONE_OFF') {
		return {
			email,
			...stateOrProvinceErrors,
		};
	}
	return {
		email,
		firstName,
		lastName,
		...stateOrProvinceErrors,
	};
}

function userCanPurchaseRecurring(state: ContributionsState): boolean {
	const userIsRecurringContributor =
		state.page.user.isRecurringContributorError ?? false;
	const userIsBuyingSupporterPlus = isSupporterPlusPurchase(state);

	if (userIsRecurringContributor && !userIsBuyingSupporterPlus) {
		return false;
	}
	return true;
}

export function getUserCanTakeOutContribution(
	state: ContributionsState,
): boolean {
	const contributionType = getContributionType(state);
	if (contributionType === 'ONE_OFF') {
		return true;
	}
	return userCanPurchaseRecurring(state);
}
