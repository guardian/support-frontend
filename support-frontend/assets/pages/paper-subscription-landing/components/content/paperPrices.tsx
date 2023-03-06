import { css } from '@emotion/react';
import {
	between,
	brand,
	from,
	headline,
	space,
} from '@guardian/source-foundations';
import { SvgInfo } from '@guardian/source-react-components';
import FlexContainer from 'components/containers/flexContainer';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import LinkTo from './linkTo';

export type PaperPricesPropTypes = {
	activeTab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	products: Product[];
	isPriceCardsAbTestVariant: boolean;
};
const pricesSection = css`
	padding: 0 ${space[3]}px ${space[12]}px;
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
	margin-top: ${space[4]}px;
	${from.tablet} {
		margin-top: ${space[6]}px;
	}
`;

const priceBoxes = css`
	margin-top: ${space[6]}px;
	justify-content: flex-start;
	${from.tablet} {
		margin-top: ${space[12]}px;
	}
`;
const priceBoxesVariant = css`
	margin-top: 0px;
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
			margin-right: ${space[4]}px;
		}
	}
	${between.tablet.and.desktop} {
		padding: ${space[3]}px ${space[2]}px;
	}
	${from.desktop} {
		&:not(:last-of-type) {
			margin-right: ${space[5]}px;
		}
	}
`;

const productOverrideWithLabel = css`
	${productOverride}
	&:not(:first-of-type) {
		margin-top: ${space[12]}px;
	}
	${from.tablet} {
		&:not(:first-of-type) {
			margin-top: 0;
		}
	}
`;

const pricesInfo = css`
	margin-top: ${space[6]}px;
`;
const pricesTabs = css`
	margin-bottom: 13px;
	display: flex;
	border-bottom: 1px solid ${brand[600]};
`;

export function PaperPrices({
	activeTab,
	setTabAction,
	products,
	isPriceCardsAbTestVariant,
}: PaperPricesPropTypes): JSX.Element {
	const infoText = `${
		activeTab === HomeDelivery ? 'Delivery is included. ' : ''
	}You can cancel your subscription at any time`;
	return (
		<section css={pricesSection} id="subscribe">
			<h2
				css={
					isPriceCardsAbTestVariant
						? [pricesHeadline, pricesHeadlineVariant]
						: pricesHeadline
				}
			>
				Pick your subscription package below
			</h2>
			<div css={pricesTabs}>
				<LinkTo
					tab={Collection}
					setTabAction={setTabAction}
					activeTab={activeTab}
					isPricesTabLink
				>
					Subscription card
				</LinkTo>
				<LinkTo
					tab={HomeDelivery}
					setTabAction={setTabAction}
					activeTab={activeTab}
					isPricesTabLink
				>
					Home Delivery
				</LinkTo>
			</div>
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
						priceCopy={product.priceCopy}
						offerCopy={product.offerCopy}
						buttonCopy={product.buttonCopy}
						href={product.href}
						onClick={product.onClick}
						onView={product.onView}
						label={product.label}
					/>
				))}
			</FlexContainer>
			<div css={pricesInfo}>
				<ProductInfoChip icon={<SvgInfo />}>{infoText}</ProductInfoChip>
			</div>
		</section>
	);
}
