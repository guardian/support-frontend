import { css } from '@emotion/react';
import { palette, space, textSans17 } from '@guardian/source/foundations';
import {
	AUDCountries,
	Canada,
	type CountryGroupId,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { ActiveProductKey } from 'helpers/productCatalog';

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
					Your rates are listed above. Regular rates are $18/month or $180/year
					for All-Access Digital and $28/month or $280/year for Digital Plus.
				</p>
			);
		case Canada:
			return (
				<p css={maxRateDisclaimer}>
					Your rates are listed above. Regular rates are $18/month or $180/year
					for All-Access Digital and $30/month or $300/year for Digital Plus.
				</p>
			);
		case AUDCountries:
			return (
				<p css={maxRateDisclaimer}>
					Your rates are listed above. Regular rates are $25/month or $250/year
					for All-Access Digital and $30/month or $300/year for Digital Plus.
				</p>
			);
		default:
			return null;
	}
}
