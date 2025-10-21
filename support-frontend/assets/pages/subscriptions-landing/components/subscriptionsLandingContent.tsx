// components
import { css } from '@emotion/react';
import { brandAlt, from, neutral } from '@guardian/source/foundations';
import { getSubscriptionCopy } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingPropTypes } from '../subscriptionsLandingProps';
import FeatureHeader from './featureHeader';
import SubscriptionsProduct from './subscriptionsProduct';

const subscriptions__product_container = css`
	position: relative;
	padding: 0 0 40px;
	background-color: ${neutral[93]};

	${from.desktop} {
		padding: 0 20px 40px;
	}

	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100px;
		border-bottom: 1px solid ${neutral[86]};
		background-color: ${brandAlt[400]};
		display: block;
		top: 0;
		left: 0;
	}
`;

const isFeature = (index: number) => index === 0 || index === 2; // make the first and third card a feature

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
			<div css={subscriptions__product_container}>
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
						classModifier={product.classModifier ?? []}
						benefits={product.benefits}
					/>
				))}
			</div>
		</div>
	);
}

export default SubscriptionsLandingContent;
