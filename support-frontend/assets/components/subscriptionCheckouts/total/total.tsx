import React from 'react';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import { displayPrice } from 'helpers/productPrice/priceDescriptions';
import {
	getAppliedPromo,
	hasDiscount,
	hasIntroductoryPrice,
} from 'helpers/productPrice/promotions';
import { isNumeric } from 'helpers/productPrice/productPrices';
import { IsoCurrency } from 'helpers/internationalisation/currency';
import { Promotion } from 'helpers/productPrice/promotions';
import { Option } from 'helpers/types/option';
import * as styles from './totalStyles';
type Props = {
	price: number;
	currency: IsoCurrency;
	promotions?: Promotion[];
};

const getPrice = (promotion: Option<Promotion>, price: number): number => {
	if (hasIntroductoryPrice(promotion) && promotion.introductoryPrice) {
		return promotion.introductoryPrice.price;
	}

	if (hasDiscount(promotion) && isNumeric(promotion.discountedPrice)) {
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
