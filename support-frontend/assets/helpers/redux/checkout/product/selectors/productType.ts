import type { ContributionType } from 'helpers/contributions';
import { contributionTypes } from 'helpers/contributions';
import { getValidContributionTypesFromUrlOrElse } from 'helpers/forms/checkouts';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	DigitalPack,
	GuardianWeekly,
	Paper,
	PaperAndDigital,
} from 'helpers/productPrice/subscriptions';
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

function getDefaultContributionType(
	state: ContributionsState,
): ContributionType {
	const { countryGroupId } = state.common.internationalisation;
	const contributionTypes = getValidContributionTypesFromUrlOrElse(
		state.common.settings.contributionTypes,
	);
	const contribTypesForLocale = contributionTypes[countryGroupId];
	const defaultContributionType =
		contribTypesForLocale.find((contribType) => contribType.isDefault) ??
		contribTypesForLocale[0];

	return defaultContributionType.contributionType;
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
	if (match) {
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
