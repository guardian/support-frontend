// components
import { getSubscriptionCopy } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingPropTypes } from '../subscriptionsLandingProps';
import FeatureHeader from './featureHeader';
import SubscriptionsProduct from './subscriptionsProduct';

const isFeature = (index: number) => index === 0; // make the first card a feature

function SubscriptionsLandingContent({
	countryGroupId,
	pricingCopy,
	participations,
}: SubscriptionsLandingPropTypes): JSX.Element | null {
	if (!pricingCopy) {
		return null;
	}

	const supportMsg = 'Support the Guardian with a print subscription';

	const subscriptionCopy = getSubscriptionCopy(
		countryGroupId,
		pricingCopy,
		participations,
	);

	const blackFridayPeriod = new Date(2023, 11, 30);
	const isBlackFriday = new Date() < blackFridayPeriod;

	return (
		<div
			className="subscriptions-landing-page"
			id="qa-subscriptions-landing-page"
		>
			<FeatureHeader featureHeaderMsg={supportMsg} />
			<div className="subscriptions__product-container">
				{subscriptionCopy.map((product, index) => (
					<SubscriptionsProduct
						title={product.title}
						subtitle={
							isBlackFriday && product.title === 'Guardian Weekly'
								? 'Annual'
								: product.subtitle ?? ''
						}
						description={product.description}
						productImage={product.productImage}
						buttons={product.buttons}
						offer={
							isBlackFriday && product.title === 'Guardian Weekly'
								? 'Black Friday Offer: 1/3 off'
								: product.offer
						}
						isFeature={isFeature(index)}
						classModifier={product.classModifier ?? []}
						participations={participations}
					/>
				))}
			</div>
		</div>
	);
}

export default SubscriptionsLandingContent;
