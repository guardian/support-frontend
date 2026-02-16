import { css } from '@emotion/react';
import {
	neutral,
	palette,
	space,
	textSans12,
} from '@guardian/source/foundations';
import {
	Link,
	SvgGift,
	SvgInfoRound,
	themeLinkBrand,
} from '@guardian/source/react-components';
import ProductInfoChip from 'components/product/productInfoChip';
import { guardianWeeklyTermsLink } from 'helpers/legal';
import { termsLink } from 'pages/supporter-plus-landing/components/paymentTsAndCs';

const pricesInfo = css`
	margin-top: ${space[6]}px;
	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;
const pricesInfoWeeklyDigital = css`
	div {
		${textSans12};
		font-size: 15px;
	}
	margin-top: ${space[4]}px;
`;
const termsLinkStyle = css`
	${textSans12};
	color: ${palette.neutral[100]};
	margin-left: ${space[9]}px;
	margin-top: -12px;
`;

export const weeklyTermsAndConditionsLink = () =>
	termsLink('Terms and Conditions', guardianWeeklyTermsLink);

type WeeklyPriceInfoProps = {
	isGift?: boolean;
	showGift?: boolean;
};
export function WeeklyPriceInfo({
	isGift,
	showGift,
}: WeeklyPriceInfoProps): JSX.Element {
	const deliveryCostInfo = (
		<div>
			Delivery cost included.{' '}
			{!isGift && 'You can cancel your subscription at any time'}
			{!showGift && <>. View full&nbsp;{weeklyTermsAndConditionsLink()}</>}
		</div>
	);
	return (
		<div css={[pricesInfo, !showGift && pricesInfoWeeklyDigital]}>
			{!isGift && showGift && (
				<ProductInfoChip icon={<SvgGift />}>
					Gifting is available
				</ProductInfoChip>
			)}
			<ProductInfoChip icon={<SvgInfoRound />}>
				{deliveryCostInfo}
			</ProductInfoChip>
			{showGift && (
				<ProductInfoChip>
					<Link
						href={guardianWeeklyTermsLink}
						cssOverrides={termsLinkStyle}
						theme={themeLinkBrand}
					>
						Click here to see full Terms and Conditions
					</Link>
				</ProductInfoChip>
			)}
		</div>
	);
}
