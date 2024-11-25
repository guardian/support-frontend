import type { ReactNode } from 'react';
import type { Product } from 'components/product/productOption';
import type {
	FulfilmentOptions,
	PaperFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
	getDiscountVsRetail,
	getProductPrice,
	showPrice,
} from 'helpers/productPrice/productPrices';
import { finalPrice, getAppliedPromo } from 'helpers/productPrice/promotions';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import type { TrackingProperties } from 'helpers/productPrice/subscriptions';
import { paperCheckoutUrl } from 'helpers/urls/routes';
import { getTitle } from '../helpers/products';
import { PaperPrices } from './content/paperPrices';

// ---- Helpers ----- //
const getPriceCopyString = (
	price: ProductPrice,
	productCopy: ReactNode = null,
): ReactNode => {
	const promotion = getAppliedPromo(price.promotions);

	if (promotion?.numberOfDiscountedPeriods) {
		return (
			<>
				per month for {promotion.numberOfDiscountedPeriods} months{productCopy},
				then {showPrice(price)} after
			</>
		);
	}

	return <>per month{productCopy}</>;
};

const getOfferText = (price: ProductPrice, promo?: Promotion) => {
	if (promo && price.savingVsRetail && promo.discount?.amount) {
		const discount = getDiscountVsRetail(
			price.price,
			price.savingVsRetail,
			promo.discount.amount,
		);
		if (discount > 0) {
			return `Save ${discount}% on retail price`;
		} else {
			return '';
		}
	}

	if (price.savingVsRetail && price.savingVsRetail > 0) {
		return `Save ${price.savingVsRetail}% on retail price`;
	}

	return '';
};

const getUnavailableOutsideLondon = (
	fulfilmentOption: FulfilmentOptions,
	productOption: PaperProductOptions,
) =>
	fulfilmentOption === 'HomeDelivery' &&
	(productOption === 'Saturday' || productOption === 'Sunday');

// ---- Plans ----- //
const copy: Record<
	PaperFulfilmentOptions,
	Record<PaperProductOptions, JSX.Element>
> = {
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
): Product[] =>
	ActivePaperProductTypes.map((productOption) => {
		const priceAfterPromosApplied = finalPrice(
			productPrices,
			'GB',
			'Monthly',
			fulfilmentOption,
			productOption,
		);
		const promotion = getAppliedPromo(priceAfterPromosApplied.promotions);
		const promoCode = promotion ? promotion.promoCode : null;
		const trackingProperties: TrackingProperties = {
			id: `subscribe_now_cta-${[productOption, fulfilmentOption].join()}`,
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		};
		const nonDiscountedPrice = getProductPrice(
			productPrices,
			'GB',
			'Monthly',
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
			offerCopy: getOfferText(priceAfterPromosApplied, promotion),
			label: labelText,
			unavailableOutsideLondon: getUnavailableOutsideLondon(
				fulfilmentOption,
				productOption,
			),
		};
	});

type PaperProductPricesProps = {
	productPrices: ProductPrices | null | undefined;
	tab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
};

function PaperProductPrices({
	productPrices,
	tab,
	setTabAction,
}: PaperProductPricesProps): JSX.Element | null {
	if (!productPrices) {
		return null;
	}

	const products = getPlans(tab, productPrices);
	return (
		<PaperPrices
			activeTab={tab}
			products={products}
			setTabAction={setTabAction}
		/>
	);
}

// ----- Exports ----- //
export default PaperProductPrices;
