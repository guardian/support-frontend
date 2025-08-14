import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getStudentDiscount } from '../helpers/discountDetails';
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
		fullPriceWithCurrency,
		periodNoun,
		promoDuration,
	} = getStudentDiscount(geoId, ratePlanKey);

	const showDiscountPrice =
		discountPriceWithCurrency &&
		discountPriceWithCurrency !== fullPriceWithCurrency;

	if (showDiscountPrice) {
		return (
			<>
				{discountPriceWithCurrency}
				<small>/{periodNoun}</small>
				{promoDuration && <small>{`for ${promoDuration}`}</small>}
				<span
					css={originalPriceStrikeThrough}
				>{`${fullPriceWithCurrency}/${periodNoun}`}</span>
			</>
		);
	}

	return (
		<>
			{fullPriceWithCurrency}
			<small>/{periodNoun}</small>
		</>
	);
}
