import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';
import { SvgInfo } from '@guardian/src-icons';
import React from 'react';
import FlexContainer from 'components/containers/flexContainer';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';
import SvgGift from 'components/svgs/gift';

export type PropTypes = {
	orderIsAGift: boolean;
	products: Product[];
};
const pricesSection = css`
	padding: 0 ${space[3]}px ${space[12]}px;
`;
const priceBoxes = css`
	margin-top: ${space[6]}px;
	justify-content: flex-start;
	align-items: stretch;
	${from.desktop} {
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
	${headline.medium({
		fontWeight: 'bold',
	})};
`;
const pricesSubHeadline = css`
	${body.medium()}
	padding-bottom: ${space[2]}px;
`;
const pricesInfo = css`
	margin-top: ${space[6]}px;
`;

function Prices({ orderIsAGift, products }: PropTypes) {
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
							product.label ? productOverrideWithLabel : productOverride
						}
						title={product.title}
						price={product.price}
						offerCopy={product.offerCopy}
						priceCopy={product.priceCopy}
						buttonCopy={product.buttonCopy}
						href={product.href}
						onClick={product.onClick}
						onView={product.onView}
						label={product.label}
					/>
				))}
			</FlexContainer>
			<div css={pricesInfo}>
				{!orderIsAGift && (
					<ProductInfoChip icon={<SvgGift />}>
						Gifting is available
					</ProductInfoChip>
				)}
				<ProductInfoChip icon={<SvgInfo />}>
					Delivery cost included.{' '}
					{!orderIsAGift && 'You can cancel your subscription at any time'}
				</ProductInfoChip>
			</div>
		</section>
	);
}

export default Prices;
