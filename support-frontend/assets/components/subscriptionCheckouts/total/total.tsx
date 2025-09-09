import type { IsoCurrency } from '@modules/internationalisation/currency';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import { displayPrice } from 'helpers/productPrice/priceDescriptions';
import type { Promotion } from 'helpers/productPrice/promotions';
import * as styles from './totalStyles';

type Props = {
	price: number;
	currency: IsoCurrency;
	promotions?: Promotion[];
};

function Total({ price, currency }: Props) {
	const glyph = extendedGlyph(currency);
	const formattedPrice = displayPrice(glyph, price);
	return (
		<div css={styles.container}>
			<div css={styles.wrapper}>
				<span>Total</span>
				<span>{formattedPrice}</span>
			</div>
		</div>
	);
}

Total.defaultProps = {
	promotions: [],
};
export default Total;
