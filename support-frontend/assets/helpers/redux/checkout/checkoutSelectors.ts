import type { ContributionsState } from '../contributionsStore';

export function getAllErrorsForContributions(
	state: ContributionsState,
): Partial<Record<string, string[]>> {
	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors;

	return {
		firstName,
		lastName,
		email,
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors;
	const allErrorsLength =
		(firstName?.length ?? 0) && (lastName?.length ?? 0) && (email?.length ?? 0);

	return !!allErrorsLength;
}
