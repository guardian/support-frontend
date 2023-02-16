import { css } from '@emotion/react';
import {
	body,
	from,
	headline,
	neutral,
	space,
} from '@guardian/source-foundations';
import { SvgGift, SvgInfo } from '@guardian/source-react-components';
import FlexContainer from 'components/containers/flexContainer';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';

export type PropTypes = {
	orderIsAGift: boolean;
	products: Product[];
	isPriceCardsAbTestVariant: boolean;
};

const pricesSection = css`
	padding: 0 ${space[3]}px ${space[12]}px;
	color: ${neutral[100]};
`;

const priceBoxes = css`
	margin-top: ${space[6]}px;
	justify-content: flex-start;
	align-items: stretch;
	${from.desktop} {
		margin-top: ${space[9]}px;
	}
`;

const priceBoxesVariant = css`
	margin-top: ${space[4]}px;
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
	${headline.xsmall({
		fontWeight: 'bold',
	})};

	${from.tablet} {
		font-size: 34px;
	}
`;

const pricesHeadlineVariant = css`
	margin-top: ${space[3]}px;
	margin-bottom: ${space[4]}px;

	${from.tablet} {
		margin-top: ${space[9]}px;
	}
`;

const pricesSubHeadline = css`
	${body.medium()}
	padding-bottom: ${space[2]}px;
`;

const pricesSubHeadlineVariant = css`
	${from.tablet} {
		margin-bottom: ${space[12]}px;
	}
`;

const pricesInfo = css`
	margin-top: ${space[6]}px;
`;

function Prices({
	orderIsAGift,
	products,
	isPriceCardsAbTestVariant,
}: PropTypes): JSX.Element {
	return (
		<section css={pricesSection} id="subscribe">
			<h2
				css={
					isPriceCardsAbTestVariant
						? [pricesHeadline, pricesHeadlineVariant]
						: pricesHeadline
				}
			>
				Subscribe to the Guardian Weekly today
			</h2>
			<p
				css={
					isPriceCardsAbTestVariant
						? [pricesSubHeadline, pricesSubHeadlineVariant]
						: pricesSubHeadline
				}
			>
				{orderIsAGift ? 'Select a gift period' : "Choose how you'd like to pay"}
			</p>
			<FlexContainer
				cssOverrides={
					isPriceCardsAbTestVariant
						? [priceBoxes, priceBoxesVariant]
						: priceBoxes
				}
			>
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
