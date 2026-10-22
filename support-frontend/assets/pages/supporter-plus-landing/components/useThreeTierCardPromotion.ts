import type { Currency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { useEffect } from 'react';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	buildThreeTierCardPromoTerms,
	discountSummaryCopy,
} from 'helpers/productPrice/promotions';

type UseThreeTierCardPromotionProps = {
	promotion?: Promotion;
	promoCount: number;
	title: string;
	price: number;
	currency: Currency;
	billingPeriod: BillingPeriod;
};

/**
 * Derives the promotion copy for a three tier card and registers the card's
 * promotion terms in PromoTermsContext while the promotion is shown.
 */
export function useThreeTierCardPromotion({
	promotion,
	promoCount,
	title,
	price,
	currency,
	billingPeriod,
}: UseThreeTierCardPromotionProps) {
	const { setPromoTerms } = usePromoTerms();

	// Matches the asterisks at the start of this promotion's terms
	const discountMarker = '*'.repeat(promoCount);

	const discountSummary =
		promotion && discountSummaryCopy(currency, price, promotion, billingPeriod);

	useEffect(() => {
		if (
			!promotion?.discount ||
			promotion.discountedPrice === undefined ||
			!discountSummary
		) {
			return;
		}
		const description = buildThreeTierCardPromoTerms(
			discountMarker,
			title,
			discountSummary,
			promotion,
		);

		setPromoTerms((currentPromos) => [
			...currentPromos.filter(
				({ promoCode }) => promoCode !== promotion.promoCode,
			),
			{ promoCode: promotion.promoCode, description },
		]);

		// Remove this card's entry when its summary changes or it unmounts
		return () => {
			setPromoTerms((currentPromos) =>
				currentPromos.filter(
					({ promoCode }) => promoCode !== promotion.promoCode,
				),
			);
		};
	}, [discountSummary, promotion, promoCount, title, setPromoTerms]);

	return {
		discountSummary: `${discountSummary}${discountMarker}`,
	};
}
