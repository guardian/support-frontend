import type { ContributionType } from 'helpers/contributions';
import { contributionTypes } from 'helpers/contributions';
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
import type { GuardianProduct } from './state';

function isContribution(product: GuardianProduct): product is ContributionType {
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

export function getSubscriptionType(
	state: SubscriptionsState,
): SubscriptionProduct {
	const { productType } = state.page.checkoutForm.product;

	if (isSubscription(productType)) {
		return productType;
	}
	// TODO: We are very unlikely to hit this, but we should have a way of determining what the product 'really' is
	// Maybe from the URL?
	return DigitalPack;
}
