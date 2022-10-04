import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { StripeElements } from './stripeElements';

export function ContributionsStripe({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	const country = useContributionsSelector(
		(state) => state.common.internationalisation.countryId,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);

	const stripeAccount = stripeAccountForContributionType[contributionType];
	const stripeKey = getStripeKey(stripeAccount, country, isTestUser ?? false);

	/**
	 * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
	 * Instead, we create separate instances for ONE_OFF and REGULAR
	 */
	return (
		<StripeElements key={stripeKey} stripeKey={stripeKey}>
			{children}
		</StripeElements>
	);
}
