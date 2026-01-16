import type { ContributionType } from 'helpers/contributions';
import { contributionTypes } from 'helpers/contributions';
import type { GuardianProduct } from '../state';

export function isContribution(
	product: GuardianProduct,
): product is ContributionType {
	return contributionTypes.includes(product);
}
