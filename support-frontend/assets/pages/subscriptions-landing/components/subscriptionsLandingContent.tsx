import { getSubscriptionCopy } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingProps } from '../subscriptionsLandingProps';
import FeatureHeader from './featureHeader';
import { subscriptionsProductContainerStyle } from './subscriptionsLandingContentStyles';
import SubscriptionsProduct from './subscriptionsProduct';

const isFeature = (index: number) => index === 0 || index === 2; // make the first and third card a feature

function SubscriptionsLandingContent({
	countryGroupId,
	pricingCopy,
	participations,
}: SubscriptionsLandingProps): JSX.Element | null {
	if (!pricingCopy) {
		return null;
	}

	const supportMsg = 'Support the Guardian with a print subscription';

	const subscriptionCopy = getSubscriptionCopy(
		countryGroupId,
		pricingCopy,
		participations,
	);

	const blackFridayPeriod = new Date(2023, 11, 1);
	const isBlackFriday = new Date() < blackFridayPeriod;

	const validBlackFridayProduct = (
		isBlackFriday: boolean,
		productTitle: string,
	): boolean => {
		return isBlackFriday && productTitle === 'Guardian Weekly';
	};

	return (
		<div
			className="subscriptions-landing-page"
			id="qa-subscriptions-landing-page"
		>
			<FeatureHeader featureHeaderMsg={supportMsg} />
			<div css={subscriptionsProductContainerStyle}>
				{subscriptionCopy.map((product, index) => (
					<SubscriptionsProduct
						title={product.title}
						subtitle={
							validBlackFridayProduct(isBlackFriday, product.title)
								? 'Annual'
								: product.subtitle ?? ''
						}
						description={product.description}
						productImage={product.productImage}
						buttons={product.buttons}
						offer={
							validBlackFridayProduct(isBlackFriday, product.title)
								? 'Black Friday Offer: 1/3 off'
								: product.offer
						}
						isFeature={isFeature(index)}
						cssOverrides={product.cssOverrides}
						benefits={product.benefits}
					/>
				))}
			</div>
		</div>
	);
}

export default SubscriptionsLandingContent;
