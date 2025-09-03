import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	palette,
	space,
} from '@guardian/source/foundations';
import { SvgInfoRound } from '@guardian/source/react-components';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import FlexContainer from 'components/containers/flexContainer';
import ProductInfoChip from 'components/product/productInfoChip';
import type { Product } from 'components/product/productOption';
import ProductOption from 'components/product/productOption';
import { observerLinks } from 'helpers/legal';
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
`;

const pricesBoxesGridLayout = css`
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
	a {
		color: ${palette.neutral[100]};
	}
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
	const infoTextMessages = {
		delivery: 'Delivery is included.',
		cancel_subscripton: 'You can cancel your subscription at any time.',
		sunday_subscription: `Sunday only subscriptions for The Observer are offered by Tortoise Media Ltd. \
							  Tortoise Media's <a href="${observerLinks.TERMS}">terms and conditions</a> and \
							   <a href="${observerLinks.PRIVACY}">privacy policy</a> will apply.`,
	};

	const infoText = [
		activeTab === HomeDelivery ? infoTextMessages.delivery : '',
		infoTextMessages.cancel_subscripton,
		infoTextMessages.sunday_subscription,
	].join(' ');

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
			<FlexContainer cssOverrides={[priceBoxes, pricesBoxesGridLayout]}>
				{products.map((product) => (
					<ProductOption
						cssOverrides={
							product.showLabel ? productOverrideWithLabel : productOverride
						}
						title={product.title}
						price={product.price}
						priceCopy={product.priceCopy}
						offerCopy={product.offerCopy}
						buttonCopy={product.buttonCopy}
						href={product.href}
						onClick={product.onClick}
						onView={product.onView}
						showLabel={product.showLabel}
						productLabel={product.productLabel}
						unavailableOutsideLondon={product.unavailableOutsideLondon}
					/>
				))}
			</FlexContainer>
			<div css={pricesInfo}>
				<ProductInfoChip icon={<SvgInfoRound />}>
					<p dangerouslySetInnerHTML={{ __html: infoText }}></p>
				</ProductInfoChip>
			</div>
		</section>
	);
}
