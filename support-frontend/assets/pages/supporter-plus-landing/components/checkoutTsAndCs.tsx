import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral, textSans12 } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	type ActiveProductKey,
	productCatalogTsAndCs,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans12};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

interface CheckoutTsAndCsProps {
	productKey: ActiveProductKey;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	promotion?: Promotion;
	mobileTheme?: FinePrintTheme;
	cssOverrides?: SerializedStyles;
}
export function CheckoutTsAndCs({
	productKey,
	countryGroupId,
	contributionType,
	promotion,
	mobileTheme = 'dark',
}: CheckoutTsAndCsProps): JSX.Element {
	const productTsAndCs = productCatalogTsAndCs(
		productKey,
		countryGroupId,
		contributionType,
		promotion,
	);
	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				<div>
					{productTsAndCs.map((line) => {
						return (
							<div
								css={marginTop}
								dangerouslySetInnerHTML={{ __html: line.copy }}
							/>
						);
					})}
				</div>
			</FinePrint>
		</div>
	);
}
