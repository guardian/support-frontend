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

	const subscriptionCopy = getSubscriptionCopy(
		countryGroupId,
		pricingCopy,
		participations,
	);
	return (
		<div
			className="subscriptions-landing-page"
			id="qa-subscriptions-landing-page"
		>
			<FeatureHeader />
			<div className="subscriptions__product-container">
				{subscriptionCopy.map((product, index) => (
					<SubscriptionsProduct
						title={product.title}
						subtitle={product.subtitle ?? ''}
						description={product.description}
						productImage={product.productImage}
						buttons={product.buttons}
						offer={product.offer}
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
