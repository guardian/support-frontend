import type { ContributionsState } from '../contributionsStore';
import { getContributionType } from './product/selectors/productType';

export function getAllErrorsForContributions(
	state: ContributionsState,
): Partial<Record<string, string[]>> {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	if (contributionType === 'ONE_OFF') {
		return {
			email,
		};
	}
	return {
		firstName,
		lastName,
		email,
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	if (contributionType === 'ONE_OFF') {
		return !!email?.length;
	}

	const allErrorsLength =
		!!firstName?.length || !!lastName?.length || !!email?.length;

	return allErrorsLength;
}
