import { css } from '@emotion/react';
import { brandAlt, from, neutral } from '@guardian/source/foundations';
import HeroContainer from 'components/page/hero';
import { PageTitle } from 'components/page/pageTitle';
import SubscriptionsProductDescription from 'components/subscriptionsProductDescription/subscriptionsProductDescription';
import { getSubscriptionProducts } from '../copy/subscriptionCopy';
import type { SubscriptionsLandingProps } from '../subscriptionsLandingProps';
import DigitalPlusProduct from './DigitalPlusProduct';
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
	margin: 20px auto;

	${from.desktop} {
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

const pageTitleStyles = css`
	background-color: ${brandAlt[400]};

	h1 {
		max-width: 900px;
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
