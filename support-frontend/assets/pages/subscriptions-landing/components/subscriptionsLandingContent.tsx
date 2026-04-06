import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';
import HeroSkeleton from 'components/page/hero';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import { getSubscriptionProducts } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingProps } from '../subscriptionsLandingProps';
import DigitalPlusProduct from './DigitalPlusProduct';
import FeatureHeader from './featureHeader';
import { subscriptionsProductContainerStyle } from './subscriptionsLandingContentStyles';

const heroCardContainer = css`
	position: relative;
	display: flex;
	align-items: stretch;
	width: 100%;
	margin: 0 auto;
	flex-wrap: wrap;
	max-width: 1290px;
	border: 1px solid ${neutral[86]};
	min-height: 320px;
	background-color: ${neutral[97]};
	z-index: 1;

	${from.desktop} {
		margin: 20px auto;
		width: calc(100% - 40px);
		min-height: 0;
	}

	${from.mobileLandscape} {
		width: calc(100% - 20px);
	}

	&:first-child {
		margin-top: 0;
	}

	&:nth-child(odd) {
		${from.tablet} {
			flex-direction: row-reverse;
		}
	}
`;

function SubscriptionsLandingContent({
	countryGroupId,
	pricingCopy,
	participations,
}: SubscriptionsLandingProps): JSX.Element | null {
	if (!pricingCopy) {
		return null;
	}

	const supportMsg = 'Support the Guardian with a print subscription';

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
			<FeatureHeader featureHeaderMsg={supportMsg} />
			<div css={subscriptionsProductContainerStyle}>
				{subscriptionCopy.map((product, index) => {
					return product.digitalPlusLayout === true ? (
						<DigitalPlusProduct {...product} />
					) : (
						<div css={heroCardContainer}>
							<HeroSkeleton
								imageSlot={product.productImage}
								contentSlot={<SubscriptionsProductDescription {...product} />}
								cssOverrides={product.cssOverrides}
								heroDirection={index % 2 !== 0 ? 'row-reverse' : undefined}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SubscriptionsLandingContent;
