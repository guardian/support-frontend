import { useEffect } from 'react';
import { Provider } from 'react-redux';
import type { ContributionType } from 'helpers/contributions';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import {
	setStripeAccountName,
	setStripePublicKey,
} from 'helpers/redux/checkout/payment/stripeAccountDetails/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { StripeElements } from './stripeElements';

type ContributionsStripeProps = {
	children: React.ReactNode;
	contributionTypeOverride?: ContributionType;
};

export function ContributionsStripe({
	children,
	contributionTypeOverride,
}: ContributionsStripeProps): JSX.Element {
	const { countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType =
		contributionTypeOverride ?? useContributionsSelector(getContributionType);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);
	const { publicKey } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);

	const dispatch = useContributionsDispatch();

	useEffect(() => {
		const stripeAccount = stripeAccountForContributionType[contributionType];
		const publicKey = getStripeKey(
			stripeAccount,
			countryId,
			currencyId,
			isTestUser,
		);

		dispatch(setStripeAccountName(stripeAccount));
		dispatch(setStripePublicKey(publicKey));
	}, [contributionType]);

	/**
	 * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
	 * Instead, we create separate instances for ONE_OFF and REGULAR
	 */
	return (
		<>
			<StripeElements key={publicKey} stripeKey={publicKey}>
				{children}
			</StripeElements>
		</>
	);
}

export function ContributionsStripeStandalone({
	children,
	contributionTypeOverride,
}: ContributionsStripeProps): JSX.Element {
	const store = initReduxForContributions();
	return (
		<>
			{/* Non-safari browsers will fail to find react-redux context value without a provider */}
			<Provider store={store}>
				<ContributionsStripe
					children={children}
					contributionTypeOverride={contributionTypeOverride}
				></ContributionsStripe>
			</Provider>
		</>
	);
}
