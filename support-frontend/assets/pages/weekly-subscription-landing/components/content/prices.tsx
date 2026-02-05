import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	palette,
	space,
	textEgyptian17,
	textSans12,
} from '@guardian/source/foundations';
import {
	Link,
	SvgGift,
	SvgInfoRound,
	themeLinkBrand,
} from '@guardian/source/react-components';
import FlexContainer from 'components/containers/flexContainer';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';

type PropTypes = {
	orderIsAGift: boolean;
	products: Product[];
};

const pricesSection = css`
	padding: 0 ${space[3]}px ${space[12]}px;
	color: ${neutral[100]};
`;

const priceBoxes = css`
	margin-top: ${space[6]}px;
	justify-content: flex-start;
	align-items: stretch;
	${from.tablet} {
		margin-top: ${space[9]}px;
	}
`;

const productOverride = css`
	&:not(:first-of-type) {
		margin-top: ${space[4]}px;
	}
	${from.tablet} {
		&:not(:first-of-type) {
			margin-top: 0;
		}
		&:not(:last-of-type) {
			margin-right: ${space[5]}px;
		}
	}
`;

const productOverrideWithLabel = css`
	&:not(:first-of-type) {
		margin-top: ${space[12]}px;
	}
	${from.tablet} {
		&:not(:first-of-type) {
			margin-top: 0;
		}
		&:not(:last-of-type) {
			margin-right: ${space[5]}px;
		}
	}
`;

const pricesHeadline = css`
	${headlineBold24};

	${from.tablet} {
		font-size: 34px;
	}
`;

const pricesSubHeadline = css`
	${textEgyptian17};
	padding-bottom: ${space[2]}px;
`;

const pricesInfo = css`
	margin-top: ${space[6]}px;
`;

const termsLink = css`
	${textSans12};
	color: ${palette.neutral[100]};
	margin-left: ${space[9]}px;
	margin-top: -12px;
`;

const termsConditionsLink =
	'https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions';

function Prices({ orderIsAGift, products }: PropTypes): JSX.Element {
	return (
		<section css={pricesSection} id="subscribe">
			<h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
			<p css={pricesSubHeadline}>
				{orderIsAGift ? 'Select a gift period' : "Choose how you'd like to pay"}
			</p>
			<FlexContainer cssOverrides={priceBoxes}>
				{products.map((product) => (
					<ProductOption
						cssOverrides={
							product.showLabel ? productOverrideWithLabel : productOverride
						}
						title={product.title}
						price={product.price}
						offerCopy={product.offerCopy}
						priceCopy={product.priceCopy}
						buttonCopy={product.buttonCopy}
						href={product.href}
						onClick={product.onClick}
						onView={product.onView}
						showLabel={product.showLabel}
						isSpecialOffer={product.isSpecialOffer}
					/>
				))}
			</FlexContainer>
			<div css={pricesInfo}>
				{!orderIsAGift && (
					<ProductInfoChip icon={<SvgGift />}>
						Gifting is available
					</ProductInfoChip>
				)}
				<ProductInfoChip icon={<SvgInfoRound />}>
					Delivery cost included.{' '}
					{!orderIsAGift && 'You can cancel your subscription at any time'}
				</ProductInfoChip>
				<ProductInfoChip>
					<Link
						href={termsConditionsLink}
						cssOverrides={termsLink}
						theme={themeLinkBrand}
					>
						Click here to see full Terms and Conditions
					</Link>
				</ProductInfoChip>
			</div>
		</section>
	);
}

export default Prices;
