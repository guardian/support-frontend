import type { Node } from 'react';
import React from 'react';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/paperProductPrices';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import {
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { paperCheckoutUrl } from 'helpers/urls/routes';
import { getTitle } from '../helpers/products';
import Prices from './content/prices';

// ---- Helpers ----- //
const getPriceCopyString = (
	price: ProductPrice,
	productCopy: Node = null,
): Node => {
	const promotion = getAppliedPromo(price.promotions);

	if (promotion && promotion.numberOfDiscountedPeriods) {
		return (
			<>
				per month for {promotion.numberOfDiscountedPeriods} months{productCopy},
				then {showPrice(price)} after
			</>
		);
	}

	return <>per month{productCopy}</>;
};

const getOfferText = (price: ProductPrice) => {
	if (price.savingVsRetail && price.savingVsRetail > 0) {
		return `Save ${price.savingVsRetail}% on retail price`;
	}

	return '';
};

// ---- Plans ----- //
const copy = {
	HomeDelivery: {
		Everyday: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		Sixday: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
		Weekend: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>,
				delivered
			</>
		),
		Saturday: (
			<>
				{' '}
				for <strong>the Guardian</strong>, delivered
			</>
		),
		Sunday: (
			<>
				{' '}
				for <strong>the Observer</strong>, delivered
			</>
		),
	},
	Collection: {
		Everyday: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		Sixday: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
		Weekend: (
			<>
				{' '}
				for <strong>the Guardian</strong> and <strong>the Observer</strong>
			</>
		),
		Saturday: (
			<>
				{' '}
				for <strong>the Guardian</strong>
			</>
		),
		Sunday: (
			<>
				{' '}
				for <strong>the Observer</strong>
			</>
		),
	},
};

const getPlans = (
	fulfilmentOption: PaperFulfilmentOptions,
	productPrices: ProductPrices,
) =>
	ActivePaperProductTypes.map((productOption) => {
		const priceAfterPromosApplied = finalPrice(
			productPrices,
			fulfilmentOption,
			productOption,
		);
		const promotion = getAppliedPromo(priceAfterPromosApplied.promotions);
		const promoCode = promotion ? promotion.promoCode : null;
		const trackingProperties = {
			id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		};
		const nonDiscountedPrice = getProductPrice(
			productPrices,
			fulfilmentOption,
			productOption,
		);
		const labelText = productOption === 'Everyday' ? 'Best Deal' : '';
		return {
			title: getTitle(productOption),
			price: showPrice(priceAfterPromosApplied),
			href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
			onClick: sendTrackingEventsOnClick(trackingProperties),
			onView: sendTrackingEventsOnView(trackingProperties),
			buttonCopy: 'Subscribe',
			priceCopy: getPriceCopyString(
				nonDiscountedPrice,
				copy[fulfilmentOption][productOption],
			),
			offerCopy: getOfferText(priceAfterPromosApplied),
			label: labelText,
		};
	});

type PaperProductPricesProps = {
	productPrices?: ProductPrices;
	tab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
};

function PaperProductPrices({
	productPrices,
	tab,
	setTabAction,
}: PaperProductPricesProps) {
	if (!productPrices) {
		return null;
	}

	const products = getPlans(tab, productPrices);
	return (
		<Prices activeTab={tab} products={products} setTabAction={setTabAction} />
	);
} // ----- Exports ----- //

export default PaperProductPrices;
