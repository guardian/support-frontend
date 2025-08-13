import type { GeoId } from 'pages/geoIdConfig';
import getPromotionData from '../helpers/getPromotionData';
import { originalPriceStrikeThrough } from './StudentProductCardStyles';

export default function PromotionPrice({ geoId }: { geoId: GeoId }) {
	const {
		discountPriceWithCurrency,
		priceWithCurrency,
		periodNoun,
		promoDuration,
	} = getPromotionData(geoId);

	return (
		<>
			{discountPriceWithCurrency ? (
				<>
					{discountPriceWithCurrency}
					<small>{`/${periodNoun} for ${promoDuration}`}</small>
					<span
						css={originalPriceStrikeThrough}
					>{`${priceWithCurrency}/${periodNoun}`}</span>
				</>
			) : (
				<>{`${priceWithCurrency}/${periodNoun}`}</>
			)}
		</>
	);
}
