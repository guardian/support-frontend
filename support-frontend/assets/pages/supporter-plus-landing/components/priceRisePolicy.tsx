import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

interface PriceRisePolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
}
export function PriceRisePolicy({
	productKey,
	ratePlanKey,
	countryGroupId,
}: PriceRisePolicyProps): JSX.Element | null {
	const noticePeriod = 30;
	return (
		<p css={marginTop}>
			We may increase the price of your subscription in the future. If this
			happens, we’ll email you at least {noticePeriod} days before it takes
			effect.
			{productKey} {ratePlanKey} {countryGroupId}
		</p>
	);
}
