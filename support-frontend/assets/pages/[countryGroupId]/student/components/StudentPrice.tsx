import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getDiscountData } from '../helpers/discountDetails';
import { originalPriceStrikeThrough } from './StudentProductCardStyles';

export default function StudentPrice({
	geoId,
	ratePlanKey,
}: {
	geoId: GeoId;
	ratePlanKey: ActiveRatePlanKey;
}) {
	const {
		discountPriceWithCurrency,
		priceWithCurrency,
		periodNoun,
		promoDuration,
	} = getDiscountData(geoId, ratePlanKey);

	const showDiscountPrice =
		discountPriceWithCurrency &&
		discountPriceWithCurrency !== priceWithCurrency;

	if (showDiscountPrice) {
		return (
			<>
				{discountPriceWithCurrency}
				<small>/{periodNoun}</small>
				{promoDuration && <small>{`for ${promoDuration}`}</small>}
				<span
					css={originalPriceStrikeThrough}
				>{`${priceWithCurrency}/${periodNoun}`}</span>
			</>
		);
	}

	return (
		<>
			{priceWithCurrency}
			<small>/{periodNoun}</small>
		</>
	);
}
