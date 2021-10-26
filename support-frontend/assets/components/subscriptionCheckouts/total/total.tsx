import React from 'react';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { displayPrice } from 'helpers/productPrice/priceDescriptions';
import {
	getAppliedPromo,
	hasDiscount,
	hasIntroductoryPrice,
} from 'helpers/productPrice/promotions';
import type { Promotion } from 'helpers/productPrice/promotions';
import * as styles from './totalStyles';

type Props = {
	price: number;
	currency: IsoCurrency;
	promotions?: Promotion[];
};

const getPrice = (promotion: Promotion | undefined, price: number): number => {
	if (hasIntroductoryPrice(promotion)) {
		return promotion.introductoryPrice.price;
	}

	if (hasDiscount(promotion)) {
		return promotion.discountedPrice;
	}

	return price;
};

const Total = ({ price, currency, promotions }: Props) => {
	const glyph = extendedGlyph(currency);
	const appliedPromotion = getAppliedPromo(promotions);
	const formattedPrice = displayPrice(glyph, getPrice(appliedPromotion, price));
	return (
		<div css={styles.container}>
			<div css={styles.wrapper}>
				<span>Total</span>
				<span>{formattedPrice}</span>
			</div>
		</div>
	);
};

Total.defaultProps = {
	promotions: [],
};
export default Total;
