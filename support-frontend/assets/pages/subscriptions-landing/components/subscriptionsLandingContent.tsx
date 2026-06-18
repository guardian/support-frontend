import HeroContainer from 'components/hero/HeroContainer';
import { PageTitle } from 'components/page/pageTitle';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import { getSubscriptionProducts } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingProps } from '../subscriptionsLandingProps';
import DigitalPlusProduct from './DigitalPlusProduct';
import {
	heroCardContainer,
	pageTitleStyles,
	subscriptionsProductContainerStyle,
} from './subscriptionsLandingContentStyles';

function SubscriptionsLandingContent({
	countryGroupId,
	pricingCopy,
	participations,
}: SubscriptionsLandingProps): JSX.Element | null {
	if (!pricingCopy) {
		return null;
	}

	const subscriptionCopy = getSubscriptionProducts(
		countryGroupId,
		pricingCopy,
		participations,
	);

	return (
		<div
			className="subscriptions-landing-page"
			id="qa-subscriptions-landing-page"
		>
			<PageTitle
				title="Support the Guardian with a print subscription"
				theme="weekly"
				cssOverrides={pageTitleStyles}
			>
				<div css={subscriptionsProductContainerStyle}>
					{subscriptionCopy.map((product, index) => {
						return product.digitalPlusLayout === true ? (
							<DigitalPlusProduct {...product} />
						) : (
							<div css={heroCardContainer}>
								<HeroContainer
									imageSlot={product.productImage}
									contentSlot={<SubscriptionsProductDescription {...product} />}
									cssOverrides={product.cssOverrides}
									heroDirection={index % 2 !== 0 ? 'reverse' : 'default'}
									imagePosition={product.imagePosition}
								/>
							</div>
						);
					})}
				</div>
			</PageTitle>
		</div>
	);
}

export default SubscriptionsLandingContent;
