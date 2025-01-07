import type { ContributionType, SelectedAmounts } from 'helpers/contributions';
import { config, contributionTypes } from 'helpers/contributions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	DigitalPack,
	GuardianWeekly,
	Paper,
	PaperAndDigital,
} from 'helpers/productPrice/subscriptions';
import { getDefaultContributionType } from 'helpers/redux/commonState/selectors';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { GuardianProduct } from '../state';

export function isContribution(
	product: GuardianProduct,
): product is ContributionType {
	return contributionTypes.includes(product);
}

export function getContributionType(
	state: ContributionsState,
): ContributionType {
	const { productType } = state.page.checkoutForm.product;
	if (isContribution(productType)) {
		return productType;
	}
	return getDefaultContributionType(state);
}

function isSubscription(
	product: GuardianProduct,
): product is SubscriptionProduct {
	return [DigitalPack, PaperAndDigital, Paper, GuardianWeekly].includes(
		product,
	);
}

function getSubscriptionTypeFromURL(): SubscriptionProduct {
	const urlPathRegex = /\/subscribe\/(.+)\/checkout/;
	const productsToUrlPath: Record<string, SubscriptionProduct> = {
		digital: DigitalPack,
		paper: Paper,
		weekly: GuardianWeekly,
	};
	const [, match] = urlPathRegex.exec(window.location.pathname) ?? [];
	if (match && productsToUrlPath[match]) {
		return productsToUrlPath[match];
	}
	return DigitalPack;
}

export function getSubscriptionType(
	state: SubscriptionsState,
): SubscriptionProduct {
	const { productType } = state.page.checkoutForm.product;

	if (isSubscription(productType)) {
		return productType;
	}
	return getSubscriptionTypeFromURL();
}

export function getSelectedAmount(
	selectedAmounts: SelectedAmounts,
	contributionType: ContributionType,
	defaultAmount: number,
) {
	return selectedAmounts[contributionType] || defaultAmount;
}

export function getMinimumContributionAmount(
	contributionType?: ContributionType,
) {
	return (state: ContributionsState): number => {
		const { countryGroupId } = state.common.internationalisation;
		const { min } =
			config[countryGroupId][contributionType ?? getContributionType(state)];

		return min;
	};
}

export function getMaximumContributionAmount(
	contributionType?: ContributionType,
) {
	return (state: ContributionsState): number => {
		const { countryGroupId } = state.common.internationalisation;
		const { max } =
			config[countryGroupId][contributionType ?? getContributionType(state)];

		return max;
	};
}
