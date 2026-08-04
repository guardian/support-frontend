import { css } from '@emotion/react';
import {
	neutral,
	palette,
	space,
	textSans12,
} from '@guardian/source/foundations';
import {
	Link,
	SvgInfoRound,
	themeLinkBrand,
} from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import ProductInfoChip from 'components/product/productInfoChip';
import { guardianWeeklyTermsLink } from 'helpers/legal';

const pricesInfo = css`
	margin-top: ${space[6]}px;
	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;

const termsLinkStyle = css`
	${textSans12};
	color: ${palette.neutral[100]};
	margin-left: ${space[9]}px;
	margin-top: -12px;
`;

type WeeklyGiftPriceInfoProps = {
	supportRegionId: SupportRegionId;
};

export function WeeklyGiftPriceInfo({
	supportRegionId,
}: WeeklyGiftPriceInfoProps): JSX.Element {
	const deliveryCostInfo = (
		<div>
			Delivery cost included. Prices shown are for{' '}
			{supportRegionId === 'uk' ? 'UK' : 'local'} delivery. Price may vary if
			the recipient is in another country.
		</div>
	);

	return (
		<div css={pricesInfo}>
			<ProductInfoChip icon={<SvgInfoRound />}>
				{deliveryCostInfo}
			</ProductInfoChip>
			<ProductInfoChip>
				<Link
					href={guardianWeeklyTermsLink}
					cssOverrides={termsLinkStyle}
					theme={themeLinkBrand}
				>
					Click here to see full Terms and Conditions
				</Link>
			</ProductInfoChip>
		</div>
	);
}
