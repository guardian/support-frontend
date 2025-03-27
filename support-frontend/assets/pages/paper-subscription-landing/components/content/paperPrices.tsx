import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	palette,
	space,
} from '@guardian/source/foundations';
import { SvgInfoRound } from '@guardian/source/react-components';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import LinkTo from './linkTo';

type PaperPricesPropTypes = {
	activeTab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	products: Product[];
};
const pricesSection = css`
	padding: 0 ${space[3]}px ${space[12]}px;
`;

const pricesHeadline = css`
	${headlineBold24};
	${from.tablet} {
		font-size: 34px;
	}
`;

const priceBoxes = css`
	display: flex;
	margin-top: ${space[6]}px;
	justify-content: flex-start;
	flex-direction: column;
	${from.tablet} {
		margin-top: 56px;
	}
	${between.tablet.and.leftCol} {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: ${space[5]}px;
	}
	${from.leftCol} {
		flex-direction: row;
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

const productOverrideWithTag = css`
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
	border-bottom: 1px solid ${palette.brand[600]};
`;

export function PaperPrices({
	activeTab,
	setTabAction,
	products,
}: PaperPricesPropTypes): JSX.Element {
	const infoText = `${
		activeTab === HomeDelivery ? 'Delivery is included. ' : ''
	}You can cancel your subscription at any time`;

	return (
		<section css={pricesSection}>
			<h2 css={pricesHeadline}>Pick your subscription package below</h2>
			<div css={pricesTabs}>
				<LinkTo
					tab={HomeDelivery}
					setTabAction={setTabAction}
					activeTab={activeTab}
					isPricesTabLink
				>
					Home Delivery
				</LinkTo>
				<LinkTo
					tab={Collection}
					setTabAction={setTabAction}
					activeTab={activeTab}
					isPricesTabLink
				>
					Subscription card
				</LinkTo>
			</div>
			<section css={priceBoxes}>
				{products.map((product) => (
					<ProductOption
						cssOverrides={
							product.tag ? productOverrideWithTag : productOverride
						}
						title={product.title}
						price={product.price}
						priceCopy={product.priceCopy}
						offerCopy={product.offerCopy}
						buttonCopy={product.buttonCopy}
						href={product.href}
						onClick={product.onClick}
						onView={product.onView}
						tag={product.tag}
						label={product.label}
						unavailableOutsideLondon={product.unavailableOutsideLondon}
					/>
				))}
			</section>
			<div css={pricesInfo}>
				<ProductInfoChip icon={<SvgInfoRound />}>{infoText}</ProductInfoChip>
			</div>
		</section>
	);
}
