import React from 'react';
// components
import SubscriptionsProduct from './subscriptionsProduct';
import FeatureHeader from './featureHeader';
import { getSubscriptionCopy } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingPropTypes } from '../subscriptionsLandingProps';

const isFeature = (index) => index === 0; // make the first card a feature

const SubscriptionsLandingContent = ({
	countryGroupId,
	pricingCopy,
}: SubscriptionsLandingPropTypes) => {
	if (!pricingCopy) {
		return null;
	}

	const subscriptionCopy = getSubscriptionCopy(countryGroupId, pricingCopy);
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
						subtitle={product.subtitle || ''}
						description={product.description}
						productImage={product.productImage}
						buttons={product.buttons}
						offer={product.offer || null}
						isFeature={isFeature(index)}
						classModifier={product.classModifier || []}
					/>
				))}
			</div>
		</div>
	);
};

export default SubscriptionsLandingContent;
