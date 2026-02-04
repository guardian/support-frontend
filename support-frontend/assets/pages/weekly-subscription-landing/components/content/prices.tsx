import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';
import { WeeklyPriceInfo } from '../weeklyPriceInfo';

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
			<WeeklyPriceInfo orderIsAGift={orderIsAGift} giftInfo={true} />
		</section>
	);
}

export default Prices;
