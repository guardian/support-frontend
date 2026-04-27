import { css } from '@emotion/react';
import { neutral, space, textSans12 } from '@guardian/source/foundations';
import { SvgInfoRound } from '@guardian/source/react-components';
import ProductInfoChip from 'components/product/productInfoChip';

const pricesInfo = css`
	margin-top: ${space[6]}px;
	color: ${neutral[100]};

	div {
		${textSans12};
		font-size: 15px;
	}
	margin-top: ${space[4]}px;

	& a {
		color: ${neutral[100]};
		:visited {
			color: ${neutral[100]};
		}
	}
`;

export function WeeklyPriceInfo(): JSX.Element {
	const deliveryCostInfo = (
		<div>
			Delivery cost included. You can cancel your subscription at any time.
		</div>
	);
	return (
		<div css={pricesInfo}>
			<ProductInfoChip icon={<SvgInfoRound />}>
				{deliveryCostInfo}
			</ProductInfoChip>
		</div>
	);
}
