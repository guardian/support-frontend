import type { ContributionType } from 'helpers/contributions';
import { contributionTypes } from 'helpers/contributions';
import type { GuardianProduct, ProductState } from './state';

function isContribution(product: GuardianProduct): product is ContributionType {
	return contributionTypes.includes(product);
}

export function getContributionType(state: ProductState): ContributionType {
	if (isContribution(state.productType)) {
		return state.productType;
	}
	return 'MONTHLY';
}
