import { css } from '@emotion/react';
import { palette, space, textSans17 } from '@guardian/source/foundations';
import {
	Canada,
	type CountryGroupId,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { ActiveProductKey } from '../../../helpers/productCatalog';

const maxRateDisclaimer = css`
	${textSans17};
	color: ${palette.neutral[100]};
	margin-bottom: ${space[2]}px;
`;

export default function CurrentMaxRatesByCountry({
	countryGroupId,
	productKey,
}: {
	countryGroupId: CountryGroupId;
	productKey?: ActiveProductKey;
}): JSX.Element | null {
	if (
		productKey &&
		productKey !== 'DigitalSubscription' &&
		productKey !== 'SupporterPlus'
	) {
		return null;
	}

	switch (countryGroupId) {
		case UnitedStates:
			return (
				<p css={maxRateDisclaimer}>
					U.S regular rates are currently: All-access digital is $18 per month
					and $180 per year. Digital plus is $28 per month and $280 per year.
				</p>
			);
		case Canada:
			return (
				<p css={maxRateDisclaimer}>
					Canada regular rates are currently: All-access digital is $18 per
					month and $180 per year. Digital plus is $30 per month and $300 per
					year.
				</p>
			);
		default:
			return null;
	}
}
